import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { initialBranchState } from "./branch.slice";
import { Branch, HospitalBranchVm } from "../../models/branch";
import { computed, effect, inject } from "@angular/core";
import { Filter, Pagination, RequestWrapper, Sort } from "src/app/common/Models/request";
import { createQueryRequest } from "src/app/management/user/userStore/store.helpers";
import { HospitalBranchService } from "../../Services/hospital-branch.service";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { catchError, debounceTime, EMPTY, finalize, of, pipe, switchMap, tap } from "rxjs";
import { activateLoading, deactivateLoading, deleteItem, setError, setItems, setPageUpdater, setSearchUpdater, setSelectedItem, setSortUpdater, setSuccess } from "src/app/common/store/generic-updaters";
import { mapApiBranchesToBranchVms, mapApiBranchToBranchVm } from "./branch.mapper";

type UpdatePayload = {
  id: string;
  body: Branch;
};
export const BranchStore = signalStore(
  withState(initialBranchState),

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

  withMethods((store, service = inject(HospitalBranchService)) => ({
    // 🔎 SEARCH
    queryBranches: rxMethod<RequestWrapper>(
      pipe(
        debounceTime(300),

        tap(() => patchState(store, activateLoading<HospitalBranchVm>())),

        switchMap(req =>
          service.search(req).pipe(

            tap(res =>
              patchState(
                store,
                setItems<HospitalBranchVm>(
                  mapApiBranchesToBranchVms(res.branches),
                  res.total
                )
              )
            ),

            catchError(err => {
              patchState(store, setError<HospitalBranchVm>(err.message));
              return of({ branches: [], total: 0 });
            }),

            finalize(() =>
              patchState(store, deactivateLoading<HospitalBranchVm>())
            )
          )
        )
      )
    ),
  })),
  withMethods((store, service = inject(HospitalBranchService)) => ({

    // 📄 GET BY ID
    getBranch: rxMethod<string>(
      pipe(
        tap(() => patchState(store, activateLoading<HospitalBranchVm>())),

        switchMap(id =>
          service.getBranch(id).pipe(

            tap(apiBranch =>
              patchState(
                store,
                setSelectedItem<HospitalBranchVm>(
                  mapApiBranchToBranchVm(apiBranch)
                )
              )
            ),

            catchError(err => {
              patchState(store, setError<HospitalBranchVm>(err.message));
              return of(null);
            }),

            finalize(() =>
              patchState(store, deactivateLoading<HospitalBranchVm>())
            )
          )
        )
      )
    ),

    // ➕ ADD
    addBranch: rxMethod<Branch>(
      pipe(
        tap(() => patchState(store, activateLoading<HospitalBranchVm>())),

        switchMap(body =>
          service.createBranch(body).pipe(

            tap(() => {
              patchState(store, setSuccess<HospitalBranchVm>(true));
              store.queryBranches(store.queryRequest());
            }),

            catchError(err => {
              patchState(store,
                setError<HospitalBranchVm>(
                  err?.error?.message ?? 'Failed to add branch'
                )
              );
              return EMPTY;
            }),

            finalize(() =>
              patchState(store, deactivateLoading<HospitalBranchVm>())
            )
          )
        )
      )
    ),

    // ✏ UPDATE
    updateBranch: rxMethod<UpdatePayload>(
      pipe(
        tap(() => patchState(store, activateLoading<HospitalBranchVm>())),

        switchMap(({ id, body }) =>
          service.updateBranch(id, body).pipe(

            tap(() => {
              patchState(store, setSuccess<HospitalBranchVm>(true));
              store.queryBranches(store.queryRequest());
            }),

            catchError(err => {
              patchState(store,
                setError<HospitalBranchVm>(
                  err?.error?.message ?? 'Failed to update branch'
                )
              );
              return EMPTY;
            }),

            finalize(() =>
              patchState(store, deactivateLoading<HospitalBranchVm>())
            )
          )
        )
      )
    ),

    // ❌ DELETE
    deleteBranch: rxMethod<string>(
      pipe(
        switchMap(id =>
          service.deleteBranch(id).pipe(

            tap(() =>
              patchState(store, deleteItem<HospitalBranchVm>(id))
            ),

            catchError(err => {
              patchState(store, setError<HospitalBranchVm>(err.message));
              return of(null);
            })
          )
        )
      )
    ),

    // 🎛 UI HELPERS
    setSearch(value: string) {
      patchState(store, setSearchUpdater<HospitalBranchVm>(value));
    },

    setPage(page: number, pageSize?: number) {
      patchState(store, setPageUpdater<HospitalBranchVm>(page, pageSize));
    },

    setSort(sort: { active: string; direction: 'asc' | 'desc' | '' }) {
      patchState(
        store,
        setSortUpdater<HospitalBranchVm>(sort.active, sort.direction)
      );
    },

    clearSort() {
      patchState(store, setSortUpdater<HospitalBranchVm>("", ""));
    },

    setSuccess(success: boolean) {
      patchState(store, setSuccess<HospitalBranchVm>(success));
    },

  })),

  withHooks({
    onInit(store) {
      effect(() => {
        store.queryBranches(store.queryRequest());
      });
    },
  })
);
