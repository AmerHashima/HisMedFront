import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { computed, effect, inject } from "@angular/core";
import { Filter, Pagination, RequestWrapper, Sort } from "src/app/common/Models/request";
import { createQueryRequest } from "src/app/management/user/userStore/store.helpers";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { catchError, debounceTime, EMPTY, finalize, of, pipe, switchMap, tap } from "rxjs";
import { activateLoading, deactivateLoading, deleteItem, setError, setItems, setPageUpdater, setSearchUpdater, setSelectedItem, setSortUpdater, setSuccess } from "src/app/common/store/generic-updaters";
import { initialLookUPState } from "./lookup.slice";
import { LookupService } from "src/app/common/service/lookup.service";
import { LookUPMaster, LookUPMasterVM } from "../models/lookup";
import { LookUpService } from "src/app/shared/services/look-up.service";
import { mapApiLookupDetailsToLookupDetailVms, mapApiLookupMastersToLookupMasterVms, mapApiLookupMasterToLookupMasterVm } from "./lookup.mappers";
import { LookupDetail } from "src/app/common/Models/lookup";


export const LOOKUPStore = signalStore(
  withState(initialLookUPState),

  withComputed(({ page, pageSize, search, sortBy, sortDirection, total }) => ({
    queryRequest: computed<RequestWrapper>(() => {

      const filters: Filter[] = [];

      if (search().trim()) {
        filters.push({
          propertyName: 'name',
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
    isLastPage: computed(() => page() * pageSize() >= total()),
  })),

  withMethods((store, service = inject(LookupService)) => ({
    // 🔎 SEARCH
    queryLookups: rxMethod<RequestWrapper>(
      pipe(
        debounceTime(300),

        tap(() => patchState(store, activateLoading<LookUPMasterVM>())),

        switchMap(req =>
          service.search(req).pipe(

            tap(res =>
              patchState(
                store,
                setItems<LookUPMasterVM>(
                  mapApiLookupMastersToLookupMasterVms(res.lookups),
                  res.total
                )
              )
            ),

            catchError(err => {
              patchState(store, setError<LookUPMasterVM>(err.message));
              return of({ branches: [], total: 0 });
            }),

            finalize(() =>
              patchState(store, deactivateLoading<LookUPMasterVM>())
            )
          )
        )
      )
    ),
  })),
  withMethods((store, service = inject(LookupService)) => ({

    // 📄 GET BY ID
    getLookupByCode: rxMethod<string>(
      pipe(
        tap(() => patchState(store, activateLoading<LookUPMasterVM>())),

        switchMap(id =>
          service.getLookUpByCode(id).pipe(

            tap(apiLookupMaster =>
              patchState(
                store,
                setSelectedItem<LookUPMasterVM>(
                  mapApiLookupMasterToLookupMasterVm(apiLookupMaster)
                )
              )
            ),

            catchError(err => {
              patchState(store, setError<LookUPMasterVM>(err.message));
              return of(null);
            }),

            finalize(() =>
              patchState(store, deactivateLoading<LookUPMasterVM>())
            )
          )
        )
      )
    ),

    // ➕ ADD
    addLookUpMaster: rxMethod<LookUPMaster>(
      pipe(
        tap(() => patchState(store, activateLoading<LookUPMasterVM>())),

        switchMap(body =>
          service.createLookupMater(body).pipe(

            tap(() => {
              patchState(store, setSuccess<LookUPMasterVM>(true));
              store.queryLookups(store.queryRequest());
            }),

            catchError(err => {
              patchState(store,
                setError<LookUPMasterVM>(
                  err?.error?.message ?? 'Failed to add lookupmaster'
                )
              );
              return EMPTY;
            }),

            finalize(() =>
              patchState(store, deactivateLoading<LookUPMasterVM>())
            )
          )
        )
      )
    ),
    addLookUpDetail: rxMethod<LookupDetail>(
      pipe(
        tap(() => patchState(store, activateLoading<LookUPMasterVM>())),

        switchMap(body =>
          service.createLookupDetail(body).pipe(
            tap(() => {
              patchState(store, setSuccess<LookUPMasterVM>(true));
              store.queryLookups(store.queryRequest());
            }),

            catchError(err => {
              patchState(store,
                setError<LookUPMasterVM>(
                  err?.error?.message ?? 'Failed to add lookup detail'
                )
              );
              return EMPTY;
            }),

            finalize(() =>
              patchState(store, deactivateLoading<LookUPMasterVM>())
            )
          )
        )
      )
    ),

    loadLookupDetails: rxMethod<string>(
      pipe(
        tap(() => patchState(store, activateLoading<LookUPMasterVM>())),

        switchMap(id =>
          service.getDetailsByLookupMasterId(id).pipe(
            tap(apiLookupMasterDetails => {
              const mappedDetails =
                mapApiLookupDetailsToLookupDetailVms(apiLookupMasterDetails);

              patchState(store, {
                details: mappedDetails,
              });
            }),

            catchError(err => {
              patchState(store, setError<LookUPMasterVM>(err.message));
              return of(null);
            }),

            finalize(() =>
              patchState(store, deactivateLoading<LookUPMasterVM>())
            )
          )
        )
      )
    ),


    // 🎛 UI HELPERS
    setSearch(value: string) {
      patchState(store, setSearchUpdater<LookUPMasterVM>(value));
    },

    setPage(page: number, pageSize?: number) {
      patchState(store, setPageUpdater<LookUPMasterVM>(page, pageSize));
    },

    setSort(sort: { active: string; direction: 'asc' | 'desc' | '' }) {
      patchState(
        store,
        setSortUpdater<LookUPMasterVM>(sort.active, sort.direction)
      );
    },

    clearSort() {
      patchState(store, setSortUpdater<LookUPMasterVM>("", ""));
    },

    setSuccess(success: boolean) {
      patchState(store, setSuccess<LookUPMasterVM>(success));
    },

  })),

  withHooks({
    onInit(store) {
      effect(() => {
        store.queryLookups(store.queryRequest());
      });
    },
  })
);
