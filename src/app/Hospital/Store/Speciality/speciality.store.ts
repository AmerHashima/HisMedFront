import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { initialSecialityState } from "./speciality,slice";
import { computed, effect, inject } from "@angular/core";
import { Filter, Pagination, RequestWrapper, Sort } from "src/app/common/Models/request";
import { createQueryRequest } from "src/app/management/user/userStore/store.helpers";
import { SpecialityService } from "../../Services/speciality.service";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { catchError, debounceTime, EMPTY, finalize, of, pipe, switchMap, tap } from "rxjs";
import { APISpeciality, Speciality, SpecialityVM } from "../../models/speciality";
import { activateLoading, deactivateLoading, setError, setItems, setPageUpdater, setSearchUpdater, setSelectedItem, setSortUpdater, setSuccess } from "src/app/common/store/generic-updaters";
import { mapApiSpecialitiesToSpecialityVMs, mapApiSpecialityToSpecialityVM } from "./speciality.mapper";

type UpdatePayload = {
  id: string;
  body: Speciality;
};

export const SpecialityStore = signalStore(
  withState(initialSecialityState),

  withComputed(({ page, pageSize, search, sortBy, sortDirection, total }) => ({
    queryRequest: computed<RequestWrapper>(() => {
      const filters: Filter[] = [];

      if (search().trim()) {
        filters.push({
          propertyName: 'licenseNumber',
          value: search().trim(),
          operation: 3,
        });
      }

      const sort: Sort[] = [];

      if (sortBy() && sortDirection()) {
        sort.push({
          sortBy: sortBy(),
          sortDirection: sortDirection()!.toUpperCase(),
        });
      }

      const pagination: Pagination = {
        getAll: false,
        pageNumber: page() - 1,
        pageSize: pageSize(),
      };

      return createQueryRequest({
        filters,
        sort,
        pagination,
        columns: [],
      });
    }),

    hasSearch: computed(() => !!search().trim()),
    isFirstPage: computed(() => page() <= 1),
    isLastPage: computed(() => {
      const loaded = page() * pageSize();
      return loaded >= total();
    }),
  })),

  withMethods((store, service = inject(SpecialityService)) => ({
    querySpecialities: rxMethod<RequestWrapper>(
      pipe(
        debounceTime(300),

        tap(() => patchState(store, activateLoading<SpecialityVM>())),

        switchMap(req =>
          service.search(req).pipe(

            tap(res =>
              patchState(
                store,
                setItems<SpecialityVM>(
                  mapApiSpecialitiesToSpecialityVMs(res.specialities),
                  res.total
                )
              )
            ),

            catchError(err => {
              patchState(
                store,
                setError<SpecialityVM>(err.message)
              );
              return of({ specialities: [], total: 0 });
            }),

            finalize(() =>
              patchState(store, deactivateLoading<SpecialityVM>())
            )
          )
        )
      )
    ),

  })),
  withMethods((store, service = inject(SpecialityService)) => ({
    getSpeciality: rxMethod<string>(
      pipe(
        tap(() =>
          patchState(store, activateLoading<SpecialityVM>())
        ),

        switchMap(id =>
          service.getSpecialty(id).pipe(

            tap(apiSpeciality =>
              patchState(
                store,
                setSelectedItem<SpecialityVM>(
                  mapApiSpecialityToSpecialityVM(apiSpeciality)
                )
              )
            ),

            catchError(err => {
              patchState(
                store,
                setError<SpecialityVM>(err.message)
              );
              return of(null);
            }),

            finalize(() =>
              patchState(store, deactivateLoading<SpecialityVM>())
            )
          )
        )
      )
    ),

    // ➕ ADD
    addSpeciality: rxMethod<Speciality>(
      pipe(
        tap(() =>
          patchState(store, activateLoading<SpecialityVM>())
        ),

        switchMap(body =>
          service.createSpeciality(body).pipe(

            tap(() => {
              patchState(
                store,
                setSuccess<SpecialityVM>(true)
              );
              store.querySpecialities(store.queryRequest());
            }),

            catchError(err => {
              patchState(
                store,
                setError<SpecialityVM>(
                  err?.error?.message ?? 'Failed to add speciality'
                )
              );
              return EMPTY;
            }),

            finalize(() =>
              patchState(store, deactivateLoading<SpecialityVM>())
            )
          )
        )
      )
    ),

    // ✏ UPDATE
    updateSpeciality: rxMethod<UpdatePayload>(
      pipe(
        tap(() =>
          patchState(store, activateLoading<SpecialityVM>())
        ),

        switchMap(({ id, body }) =>
          service.updateSpecialty(id, body).pipe(

            tap(() => {
              patchState(
                store,
                setSuccess<SpecialityVM>(true)
              );
              store.querySpecialities(store.queryRequest());
            }),

            catchError(err => {
              patchState(
                store,
                setError<SpecialityVM>(
                  err?.error?.message ?? 'Failed to update speciality'
                )
              );
              return EMPTY;
            }),

            finalize(() =>
              patchState(store, deactivateLoading<SpecialityVM>())
            )
          )
        )
      )
    ),

    // ❌ DELETE
    // deleteSpeciality: rxMethod<string>(
    //   pipe(
    //     switchMap(id =>
    //       service.deleteSpeciality(id).pipe(

    //         tap(() =>
    //           patchState(
    //             store,
    //             deleteItem<SpecialityVM>(id)
    //           )
    //         ),

    //         catchError(err => {
    //           patchState(
    //             store,
    //             setError<SpecialityVM>(err.message)
    //           );
    //           return of(null);
    //         })
    //       )
    //     )
    //   )
    // ),

    // 🎛 UI HELPERS

    clearSort() {
      patchState(
        store,
        setSortUpdater<SpecialityVM>("", "")
      );
    },

    setSuccess(success: boolean) {
      patchState(
        store,
        setSuccess<SpecialityVM>(success)
      );
    },

    setSearch(value: string) {
      patchState(
        store,
        setSearchUpdater<SpecialityVM>(value)
      );
    },

    // setPage(page: number, pageSize?: number) {
    //   patchState(
    //     store,
    //     setPageUpdater<SpecialityVM>(page, pageSize)
    //   );
    // },

    setSort(sort: { active: string; direction: 'asc' | 'desc' | '' }) {
      patchState(
        store,
        setSortUpdater<SpecialityVM>(
          sort.active,
          sort.direction
        )
      );
    },


  })),

  withHooks({
    onInit(store) {
      effect(() => {
        store.querySpecialities(store.queryRequest());
      });
    },
  })
);


