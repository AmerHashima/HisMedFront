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
import { ToastingMessagesService } from "src/app/common/service/toasting.service";
import { LoadingService } from "src/app/common/service/loading.service";

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

  withMethods((store,loader=inject(LoadingService), toast=inject(ToastingMessagesService),service = inject(HospitalBranchService)) => ({
    // 🔎 SEARCH
    queryBranches: rxMethod<RequestWrapper>(
      pipe(
        debounceTime(300),
 tap(() => {
   patchState(store, activateLoading<HospitalBranchVm>());
             loader.start();
        }),

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
              const error = err.error.errors;
              patchState(
                store,
                setError<HospitalBranchVm>(
                  error ?? 'Failed to query Branch'
                )
              );
              toast.showToast('Falied to search branches', 'error');
              return of({ branches: [], total: 0 });
            }),
            finalize(() => {
              patchState(store, deactivateLoading<HospitalBranchVm>());
              loader.stop();
            }
            )
          )
        )
      )
    ),
  })),
  withMethods((store,loader=inject(LoadingService), toast=inject(ToastingMessagesService),service = inject(HospitalBranchService)) => ({
    clearSelectedItem: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, {
            selectedItem: null
          });
        })
      )
    ),
    // 📄 GET BY ID
    getBranch: rxMethod<string>(
      pipe(
        tap(() => {
          patchState(store, activateLoading<HospitalBranchVm>());
          loader.start();
        }),
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
                          const error=err.error.errors;
                          patchState(
                            store,
                            setError<HospitalBranchVm>(
                              error ?? 'Failed to get Branch'
                            )
                          );
                  toast.showToast('Falied to retrieve Branch', 'error');

                          return of(null);
                        }),


   finalize(() => {
     patchState(store, deactivateLoading<HospitalBranchVm>());
              loader.stop();
            }
            )

          )
        )
      )
    ),

    // ➕ ADD
    addBranch: rxMethod<Branch>(
      pipe(
        tap(() => {
          patchState(store, activateLoading<HospitalBranchVm>());
          loader.start();
        }),
        switchMap(body =>
          service.createBranch(body).pipe(

            tap(() => {
              patchState(store, setSuccess<HospitalBranchVm>(true));
              toast.showToast('Branch has been added successfully', 'success');
              store.queryBranches(store.queryRequest());
            }),

            catchError(err => {
              const error = err.error.errors;
              patchState(
                store,
                setError<HospitalBranchVm>(
                  error ?? 'Failed to add Branch'
                )
              );
              toast.showToast('Falied to add Branch', 'error');

              return of(null);
            }),



            finalize(() => {
              patchState(store, deactivateLoading<HospitalBranchVm>());
              loader.stop();
            }
            )
          )
        )
      )
    ),

    // ✏ UPDATE
    updateBranch: rxMethod<UpdatePayload>(
      pipe(
        tap(() => {
          patchState(store, activateLoading<HospitalBranchVm>());
          loader.start();
        }),
        switchMap(({ id, body }) =>
          service.updateBranch(id, body).pipe(

            tap(() => {
              patchState(store, setSuccess<HospitalBranchVm>(true));
              toast.showToast('Branch has been updated successfully', 'success');

              store.queryBranches(store.queryRequest());
            }),
            catchError(err => {
              const error = err.error.errors;
              patchState(
                store,
                setError<HospitalBranchVm>(
                  error ?? 'Failed to update Branch'
                )
              );
              toast.showToast('Falied to update Branch', 'error');

              return of(null);
            }),

            finalize(() => {
              patchState(store, deactivateLoading<HospitalBranchVm>());
              loader.stop();
            }
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
              {patchState(store, deleteItem<HospitalBranchVm>(id));
              toast.showToast('Branch has been deleted successfully', 'success');
          }
            ),

            catchError(err => {
              const error = err.error.errors;
              patchState(
                store,
                setError<HospitalBranchVm>(
                  error ?? 'Failed to delete Branch'
                )
              );
              toast.showToast('Falied to delete Branch', 'error');

              return of(null);
            }),
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
