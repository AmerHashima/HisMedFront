// src\app\doctors\doctorStore\doctorStore.ts
import { signalStore, withState, withMethods, withComputed, withHooks, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { inject, computed, effect } from '@angular/core';
import { debounceTime, map,switchMap, tap, catchError, of, finalize, pipe, EMPTY, forkJoin, take, exhaustMap } from 'rxjs';
import { DoctorService } from '../service/doctor.service';
import { initialDoctorState } from './doctor.slice';
import { createQueryRequest } from 'src/app/management/user/userStore/store.helpers';
import { Filter, Pagination, RequestWrapper, Sort } from 'src/app/common/Models/request';
import {
  setDoctoSchedules,
  activateLoading,
  deactivateLoading,
  setDoctors,
  setSelectedDoctor,
  setError,
  deleteDoctor,
  setSearchUpdater,
  setPageUpdater,
  setSortUpdater,
  setSuccess,
  setSelectedDoctoSchedule,
  setScheduleSuccess,
  updateDoctorSchedule,
  deleteDoctorSchedule,
  setSelectedDoctoSchedules,
  deleteDetailDoctorSchedule,
  updateDoctorSchedules,
  updateDetailDoctorSchedule,
  deleteFullDoctorSchedule,
  addDetailDoctorSchedules,
} from './doctor.updater';
import { Doctor } from '../models/doctor';
import { ToastingMessagesService } from 'src/app/common/service/toasting.service';
import { LoadingService } from 'src/app/common/service/loading.service';
import { APIDoctorScheduleItem, DoctorSchedule, DoctorScheduleBulk, DoctorScheduleDetail, editMasterDoctorSchedule } from '../models/doctor-schedule';
import { DoctorVM } from '../models/doctor-vm';

type UpdatePayload = {
  id: string;
  body: Doctor;
};

type UpdateSchedulePayload = {
  id: string;
  body: editMasterDoctorSchedule;
}

type UpdateDetailSchedulePayload = {
  id: string;
  body: DoctorScheduleDetail;
}
export const DoctorStore = signalStore(
  withState(initialDoctorState),

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

    // Optional: nicer API for template / debugging
    hasSearch: computed(() => !!search().trim()),
    isFirstPage: computed(() => page() <= 1),
    isLastPage: computed(() => {
      const loaded = page() * pageSize();
      return loaded >= total();
    }),
  })),

  withMethods((store, loader = inject(LoadingService), toast = inject(ToastingMessagesService), service = inject(DoctorService)) => ({
    queryDoctors: rxMethod<RequestWrapper>(
      pipe(
        debounceTime(300),
        tap(() => {
          patchState(store, activateLoading);
          loader.start();
        }), switchMap(req =>
          service.search(req).pipe(
            tap(res => patchState(store, setDoctors(res.doctors, res.total))),
            catchError(err => {
              const error = err.error.errors;
              patchState(
                store,
                setError(
                  error ?? 'Failed to query doctor'
                )
              );
              toast.showToast('Falied to search doctors', 'error');

              return of({ doctors: [], total: 0 });
            }),

            finalize(() => {
              patchState(store, deactivateLoading);
              loader.stop()
            }))
        )
      )
    ),

  })),
  withMethods((store, loader = inject(LoadingService), toast = inject(ToastingMessagesService), service = inject(DoctorService)) => ({
    clearSelectedItem: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, {
            selectedDoctor: null
          });
        })
      )
    ),
    getDoctor: rxMethod<string>(
      pipe(
        tap(() => {
          patchState(store, activateLoading);
          loader.start();
        }),

        switchMap(id =>
          service.getDoctor(id).pipe(

            tap(d => {
              patchState(store, setSelectedDoctor(d));
              console.log('d', d);
            }),


            catchError(err => {
              const error = err.error.errors;

              patchState(
                store,
                setError(error ?? 'Failed to get doctor')
              );

              toast.showToast('Failed to retrieve doctor', 'error');

              return of(null);
            }),

            finalize(() => {
              patchState(store, deactivateLoading);
              loader.stop();
            })
          )
        )
      )
    ),

    loadDoctorSchedules: rxMethod<void>(
      pipe(

        pipe(
          tap(() => {
            patchState(store, activateLoading);
            loader.start();
          }),

          switchMap(() =>
            service.getMasterDoctorSchedules().pipe(

              tap(schedules => {
                patchState(store, setDoctoSchedules(schedules));
                console.log(schedules);
              }),

              catchError(err => {
                const error = err.error.errors;

                patchState(
                  store,
                  setError(error ?? 'Failed to get doctor')
                );

                toast.showToast('Failed to retrieve doctor', 'error');

                return of(null);
              }),

              finalize(() => {
                patchState(store, deactivateLoading);
                loader.stop();
              })
            )
          )
        )
    )
    ),

    queryDoctorSchedules: rxMethod<RequestWrapper>(
      pipe(
        tap(() => {
          patchState(store, activateLoading);
          loader.start();
        }),

        switchMap((body) => {
          // const filters: Filter[] = [
          //   {
          //     propertyName: 'doctorId',
          //     value: doctorId,
          //     operation: 0,
          //   },
          // ];

          // const body: RequestWrapper = {
          //   request: {
          //     filters,
          //     sort: [],
          //     pagination: {
          //       getAll: true,
          //       pageNumber: 0,
          //       pageSize: 0,
          //     },
          //     columns: [],
          //   },
          // };

          return service.queryMasterDoctorSchedules(body).pipe(

            switchMap((response) => {
              const schedules = response.doctorSchedules;

              if (!schedules.length) {
                return of([]);
              }

              const requests = schedules.map((item) =>
                service.getMasterDoctorSchedule(item.oid)
              );

              return forkJoin(requests);
            }),

            tap((bulkSchedules) => {

              patchState(
                store,
                setSelectedDoctoSchedules(bulkSchedules)
              );
            }),

            catchError((err) => {
              const error = err.error?.errors;

              patchState(
                store,
                setError(error ?? 'Failed to get doctor schedules')
              );

              toast.showToast('Failed to retrieve doctor schedules', 'error');

              return of([]);
            }),

            finalize(() => {
              patchState(store, deactivateLoading);
              loader.stop();
            })
          );
        })
      )
    ),


    addDoctor: rxMethod<Doctor>(
      pipe(
        tap(() => {
          patchState(store, activateLoading);
          loader.start();
        }),
        switchMap((body) =>
          service.createDoctor(body).pipe(
            // tap((user: ApiUser) => patchState(store, addUser(user))),
            tap(() => {
              patchState(store, setSuccess(true));
              toast.showToast('Doctor has been added successfully', 'success');

              store.queryDoctors(store.queryRequest());
            }),
            catchError(err => {
              const error = err.error.errors;
              patchState(
                store,
                setError(
                  error ?? 'Failed to add doctor'
                )
              );
              toast.showToast('Falied to add doctor', 'error');

              return of(null);
            }),

            finalize(() => {
              patchState(store, deactivateLoading);
              loader.stop()
            }))
        )
      )
    ),
    updateDoctor: rxMethod<UpdatePayload>(
      pipe(
        tap(() => {
          patchState(store, activateLoading);
          loader.start();
        }), switchMap(({ id, body }) =>
          service.updateDoctor(id, body).pipe(
            // tap(() => patchState(store, setError(''))),
            tap(() => {
              patchState(store, setSuccess(true));
              toast.showToast('Doctor has been updated successfully', 'success');

              store.queryDoctors(store.queryRequest());
            }),
            catchError(err => {
              const error = err.error.errors;
              patchState(
                store,
                setError(
                  error ?? 'Failed to update doctor'
                )
              );
              toast.showToast('Falied to update doctor', 'error');

              return of(null);
            }),
            finalize(() => {
              patchState(store, deactivateLoading);
              loader.stop()
            }))
        )
      )
    ),
    deleteDoctor: rxMethod<string>(
      pipe(
        switchMap(id =>
          service.deleteDoctor(id).pipe(
            tap(() => {
              patchState(store, deleteDoctor(id));
              toast.showToast('Doctor has been deleted successfully', 'success');
            }),
            catchError(err => {
              const error = err.error.errors;
              patchState(
                store,
                setError(
                  error ?? 'Failed to delete doctor'
                )
              );
              toast.showToast('Falied to delete doctor', 'error');

              return of(null);
            }),
          )
        )
      )
    ),

    clearSort() {
      patchState(store, setSortUpdater("", ""));
    },
    setSuccess(success: boolean) {
      patchState(store, setSuccess(success));
    },
    setScheduleSuccess(success: boolean) {
      patchState(store, setScheduleSuccess(success));
    },
    setSearch(value: string) {
      patchState(store, setSearchUpdater(value));
    },

    setPage(page: number, pageSize?: number) {
      patchState(store, setPageUpdater(page, pageSize));
    },
    setSort(sort: { active: string; direction: 'asc' | 'desc' | '' }) {
      patchState(store, setSortUpdater(sort.active, sort.direction));
    },
  })),
  withMethods((store, loader = inject(LoadingService), toast = inject(ToastingMessagesService), service = inject(DoctorService)) => ({

    getDoctorSchedule: rxMethod<string>(
      pipe(
        tap(() => {
          patchState(store, activateLoading);
          loader.start();
        }), switchMap(id =>
          service.getMasterDoctorSchedule(id).pipe(
            tap(d => console.log('in get doctor schedule')),

            tap(d => patchState(store, setSelectedDoctoSchedule(d))),
            catchError(err => {
              const error = err.error.errors;
              patchState(
                store,
                setError(
                  error ?? 'Failed to get doctor schedule'
                )
              );
              toast.showToast('Falied to retrieve doctor schedule', 'error');

              return of(null);
            }),

            finalize(() => {
              patchState(store, deactivateLoading);
              loader.stop()
            }))
        )
      )
    ),

    // addDoctorSchedule: rxMethod<DoctorSchedule>(
    //   pipe(
    //     tap(() => {
    //       patchState(store, activateLoading);
    //       loader.start();
    //     }),
    //     switchMap((body) =>
    //       service.createMasterDoctorSchedule(body).pipe(
    //         tap((schedule) => {
    //           patchState(store, setScheduleSuccess(true));
    //           patchState(store, addDoctorSchedule([schedule]));

    //           toast.showToast('Doctor slot has been added successfully', 'success');
    //         }),
    //         catchError(err => {
    //           const error = err.error.errors;
    //           patchState(
    //             store,
    //             setError(
    //               error ?? 'Failed to add doctor slot'
    //             )
    //           );
    //           toast.showToast('Falied to add doctor slot', 'error');
    //           return of(null);
    //         }),

    //         finalize(() => {
    //           patchState(store, deactivateLoading);
    //           loader.stop()
    //         }))
    //     )
    //   )
    // ),
    addBulkDoctorSchedule: rxMethod<DoctorScheduleBulk>(
      pipe(
        tap(() => {
          patchState(store, activateLoading);
          loader.start();
        }),
        switchMap((body) =>
          service.createBulkDoctorSchedule(body).pipe(
            tap((schedules) => {
              patchState(store, setScheduleSuccess(true));
              patchState(store, updateDoctorSchedules(body,schedules));
              // patchState(store, addDoctorSchedule(schedules));

              toast.showToast('Doctor Schedule has been added successfully', 'success');
            }),
            catchError(err => {
              const error = err.error.errors;
              patchState(
                store,
                setError(
                  error ?? 'Failed to add doctor schedule'
                )
              );
              toast.showToast('Falied to add doctor schedule', 'error');
              return of(null);
            }),

            finalize(() => {
              patchState(store, deactivateLoading);
              loader.stop()
            }))
        )
      )
    ),
    addDetailDoctorSchedulesBulk: rxMethod<DoctorScheduleDetail[]>(
      pipe(
        tap(() => {
          console.log('🚀 START BULK ADD');
          patchState(store, activateLoading);
          loader.start();
        }),

        switchMap((details) => {
          const requests = details.map(d =>
            service.creatDetailDoctorSchedule(d).pipe(
              tap(() => console.log('✅ request done', d)),
              catchError(err => {
                console.log('❌ request failed', d);
                return of(null); // prevent breaking forkJoin
              })
            )
          );

          return forkJoin(requests);
        }),

        // ✅ SUCCESS
        tap((results) => {
          console.log('🔥 AFTER FORKJOIN TAP');

          const validResults = results.filter(
            (r): r is APIDoctorScheduleItem => r !== null
          );

          patchState(store, addDetailDoctorSchedules(validResults));

          // ✅ 🔥 PUT TOAST HERE
          if (validResults.length) {
            toast.showToast('Slots added successfully', 'success');
          } else {
            toast.showToast('No slots were added', 'warning');
          }

          patchState(store, deactivateLoading);
          loader.stop();

          console.log('🟢 STORE LOADING = FALSE');
        }),

        // ❌ ERROR
        catchError(err => {
          console.log('❌ GLOBAL ERROR', err);

          patchState(store, setError(err?.error?.errors));

          // ✅ 🔥 ERROR TOAST HERE
          toast.showToast('Failed to add slots', 'error');

          patchState(store, deactivateLoading);
          loader.stop();

          return of([]);
        })
      )
    ),

    updateDoctorSchedule: rxMethod<UpdateSchedulePayload>(
      pipe(
        tap(() => {
          patchState(store, activateLoading);
          loader.start();
        }), switchMap(({ id, body }) =>
          service.updateMasterDoctorSchedule(id, body).pipe(
            // tap(() => patchState(store, setError(''))),
            tap((schedule) => {
              // patchState(store, setScheduleSuccess(true));
              patchState(store, updateDoctorSchedule(body,schedule));
              toast.showToast('Doctor slot has been updated successfully', 'success');

              // store.queryDoctors(store.queryRequest());
            }),
            catchError(err => {
              const error = err.error.errors;
              patchState(
                store,
                setError(
                  error ?? 'Failed to update doctor schedule'
                )
              );
              toast.showToast('Falied to update doctor schedule', 'error');

              return of(null);
            }),
            finalize(() => {
              patchState(store, deactivateLoading);
              loader.stop()
            }))
        )
      )
    ),
    updateDetailDoctorSchedule: rxMethod<UpdateDetailSchedulePayload>(
      pipe(
        tap(() => {
          patchState(store, activateLoading);
          loader.start();
        }), switchMap(({ id, body }) =>
          service.updateDetailDoctorSchedule(id, body).pipe(
            tap((schedule) => {
              patchState(store, setScheduleSuccess(true));
              patchState(store, updateDetailDoctorSchedule(schedule));
              toast.showToast('Doctor slot has been updated successfully', 'success');
              // store.queryDoctors(store.queryRequest());
            }),
            catchError(err => {
              const error = err.error.errors;
              patchState(
                store,
                setError(
                  error ?? 'Failed to update doctor schedule'
                )
              );
              toast.showToast('Falied to update doctor schedule', 'error');

              return of(null);
            }),
            finalize(() => {
              patchState(store, deactivateLoading);
              loader.stop()
            }))
        )
      )
    ),


    deleteDoctorSchedule: rxMethod<string>(
      pipe(
        switchMap(id =>
          service.deleteMasterDoctoSchedule(id).pipe(
            tap(() => {
              patchState(store, deleteDoctorSchedule(id));
              toast.showToast('Doctor schedule has been deleted successfully', 'success');
            }),
            catchError(err => {
              const error = err.error.errors;
              patchState(
                store,
                setError(
                  error ?? 'Failed to delete doctor schedule'
                )
              );
              toast.showToast('Falied to delete doctor schedule', 'error');

              return of(null);
            }),
          )
        )
      )
    ),
    deleteDetailDoctorSchedule: rxMethod<string>(
      pipe(
        switchMap(id =>
          service.deleteDetailDoctoSchedule(id).pipe(
            tap(() => {
              patchState(store, deleteDetailDoctorSchedule(id));
              toast.showToast('Doctor schedule has been deleted successfully', 'success');
            }),
            catchError(err => {
              const error = err.error.errors;
              patchState(
                store,
                setError(
                  error ?? 'Failed to delete doctor schedule'
                )
              );
              toast.showToast('Falied to delete doctor schedule', 'error');

              return of(null);
            }),
          )
        )
      )
    ),
    deleteFullSchedulePeriod: rxMethod<{
      oid: string;
      details: string[];
    }>(
      pipe(
        tap(() => {
          patchState(store, activateLoading);
          loader.start();
        }),

        switchMap(({ oid, details }) => {

          const deleteDetails$ = details.length
            ? forkJoin(
              details.map(id =>
                service.deleteDetailDoctoSchedule(id).pipe(
                  catchError(err => {
                    console.error('Detail delete failed:', id, err);
                    return of(null);
                  })
                )
              )
            )
            : of([]);

          return deleteDetails$.pipe(

            switchMap(() =>
              service.deleteMasterDoctoSchedule(oid)
            ),

            // ✅ SUCCESS
            tap(() => {
              patchState(store, deleteFullDoctorSchedule([oid]));
              toast.showToast('Schedule period deleted successfully', 'success');

              // 🔥 STOP LOADER HERE
              patchState(store, deactivateLoading);
              loader.stop();
            })
          );
        }),

        // ❌ ERROR
        catchError(err => {
          const error = err.error?.errors;

          patchState(store, setError(error ?? 'Failed to delete schedule'));
          toast.showToast('Failed to delete schedule', 'error');

          // 🔥 STOP LOADER HERE TOO
          patchState(store, deactivateLoading);
          loader.stop();

          return of(null);
        }),

        // 🛡️ fallback safety (optional)
        finalize(() => {
          loader.stop(); // just in case
        })
      )
    ),

  })),
  withHooks({
    onInit(store) {
      console.log('DoctorStore instance created');
      effect(() => {
        store.queryDoctors(store.queryRequest());
      });
    },
  })
);
