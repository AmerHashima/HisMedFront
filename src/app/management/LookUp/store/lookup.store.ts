import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { computed, effect, inject } from "@angular/core";
import { Filter, Pagination, RequestWrapper, Sort } from "src/app/common/Models/request";
import { createQueryRequest } from "src/app/management/user/userStore/store.helpers";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { catchError, debounceTime, EMPTY, finalize, of, pipe, switchMap, tap } from "rxjs";
import { activateLoading, deactivateLoading, deleteItem, setError, setItems, setPageUpdater, setSearchUpdater, setSelectedItem, setSortUpdater, setSuccess } from "src/app/common/store/generic-updaters";
import { initialLookUPState } from "./lookup.slice";
import { LookupService } from "src/app/common/service/lookup.service";
import { LookUPDetailVM, LookUPMaster, LookUPMasterVM, LookupDetail } from "../models/lookup";
// import { LookUpService } from "src/app/shared/services/look-up.service";
import { mapApiLookupDetailsToLookupDetailVms, mapApiLookupMastersToLookupMasterVms, mapApiLookupMasterToLookupMasterVm } from "./lookup.mappers";
import { ToastingMessagesService } from "src/app/common/service/toasting.service";
import { LoadingService } from "src/app/common/service/loading.service";


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
        // getAll: false,
        // pageNumber: page() - 1,
        // pageSize: pageSize(),
        getAll: true,
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

  withMethods((store, loader = inject(LoadingService), toast = inject(ToastingMessagesService), service = inject(LookupService)) => ({
    // 🔎 SEARCH

    queryLookups: rxMethod<RequestWrapper>(
      pipe(
        debounceTime(300),

        tap(() => {
          patchState(store, activateLoading<LookUPMasterVM>())
          loader.start();
        }),

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
              toast.showToast('Falied to query lookuos', 'error');
              return of({ branches: [], total: 0 });
            }),

            finalize(() => {
              patchState(store, deactivateLoading<LookUPMasterVM>());
              loader.stop();
            }
            )
          )
        )
      )
    ),
  })),
  withMethods((store, loader = inject(LoadingService), toast = inject(ToastingMessagesService), service = inject(LookupService)) => ({
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
              const error = err.error.errors;
              patchState(
                store,
                setError<LookUPMasterVM>(
                  error ?? 'Failed to get lookup'
                )
              );
              toast.showToast('Falied to get lookup', 'error');

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
        tap(() => {
          patchState(store, activateLoading<LookUPMasterVM>());
          loader.start();
        }),

        switchMap(body =>
          service.createLookupMater(body).pipe(

            tap(() => {
              patchState(store, setSuccess<LookUPMasterVM>(true));
              toast.showToast('Lookup Master has been added successfully', 'success');

              store.queryLookups(store.queryRequest());
            }),
            catchError(err => {
              const error = err.error.errors;
              patchState(
                store,
                setError<LookUPMasterVM>(
                  error ?? 'Failed to add Look up'
                )
              );
              toast.showToast('Falied to add lookup', 'error');

              return EMPTY;
            }),
            finalize(() => {
              patchState(store, deactivateLoading<LookUPMasterVM>());
              loader.stop();
            }
            )
          )
        )
      )
    ),
    addLookUpDetail: rxMethod<LookupDetail>(
      pipe(
        tap(() => {
          patchState(store, activateLoading<LookUPMasterVM>());
          loader.start();
        }),

        switchMap(body =>
          service.createLookupDetail(body).pipe(
            tap(() => {
              patchState(store, setSuccess<LookUPMasterVM>(true));
              toast.showToast('Lookup details has been added successfully', 'success');

              store.queryLookups(store.queryRequest());
            }),

            catchError(err => {
              const error = err.error.errors;
              patchState(
                store,
                setError<LookUPMasterVM>(
                  error ?? 'Failed to add Look up detail'
                )
              );
              toast.showToast('Falied to add deatils', 'error');
              return EMPTY;
            }),



            finalize(() => {
              patchState(store, deactivateLoading<LookUPMasterVM>());
              loader.stop();
            }
            )
          )
        )
      )
    ),

    // addLookUpDetail: rxMethod<LookupDetail>(
    //   pipe(
    //     tap(() => patchState(store, activateLoading<LookUPMasterVM>())),
    //     switchMap(body =>
    //       service.createLookupDetail(body).pipe(
    //         tap(apiDetail => {
    //           // Map API response to full VM
    //           const detailVM: LookUPDetailVM = {
    //             ...body,
    //             oid: apiDetail.oid,
    //             createdAt: apiDetail.createdAt ?? new Date().toISOString(),
    //             updatedAt: apiDetail.updatedAt ?? '',
    //             masterLookupCode: apiDetail.masterLookupCode
    //           };

    //           // Patch state
    //           patchState(store, {
    //             details: [...store.details(), detailVM],
    //             selectedDetail: detailVM,
    //             success: true
    //           });
    //         }),
    //         catchError(err => {
    //           patchState(store,
    //             setError<LookUPMasterVM>(
    //               err?.error?.message ?? 'Failed to add lookup detail'
    //             )
    //           );
    //           return EMPTY;
    //         }),
    //         finalize(() =>
    //           patchState(store, deactivateLoading<LookUPMasterVM>())
    //         )
    //       )
    //     )
    //   )
    // ),
    loadLookupDetails: rxMethod<string>(
      pipe(
        tap(() => {
          patchState(store, activateLoading<LookUPMasterVM>());
          loader.start();
        }),

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
              const error = err.error.errors;
              patchState(
                store,
                setError<LookUPMasterVM>(
                  error ?? 'Failed to load Look up details'
                )
              );
              toast.showToast('Falied to load deatils', 'error');

              return of(null);
            }),

            finalize(() => {
              patchState(store, deactivateLoading<LookUPMasterVM>());
              loader.stop();
            }
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
