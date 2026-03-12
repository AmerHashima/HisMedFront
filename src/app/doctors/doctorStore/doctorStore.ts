// src\app\doctors\doctorStore\doctorStore.ts
import { signalStore, withState, withMethods, withComputed, withHooks, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { inject, computed, effect } from '@angular/core';
import { debounceTime, switchMap, tap, catchError, of, finalize, pipe, EMPTY } from 'rxjs';

import { DoctorService } from '../service/doctor.service';
import { initialDoctorState } from './doctor.slice';
import { createQueryRequest } from 'src/app/management/user/userStore/store.helpers';
import { Filter, Pagination, RequestWrapper, Sort } from 'src/app/common/Models/request';
import {
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
  deleteDoctorSchedule,
  setSelectedDoctoSchedules,
} from './doctor.updater';
import { Doctor } from '../models/doctor';
import { ToastingMessagesService } from 'src/app/common/service/toasting.service';
import { LoadingService } from 'src/app/common/service/loading.service';
import { DoctorSchedule, DoctorScheduleBulk } from '../models/doctor-schedule';

type UpdatePayload = {
  id: string;
  body: Doctor;
};

type UpdateSchedulePayload={
  id: string;
  body: DoctorSchedule;
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

            switchMap(d => {
              const filters: Filter[] = [{
                propertyName: "doctorId",
                value: d.oid,
                operation: 0
              }];

              return service.getDoctorSchedules(filters);
            }),

            tap(schedules => {
              patchState(store, setSelectedDoctoSchedules(schedules));
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
          service.getDoctorSchedule(id).pipe(
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

    addDoctorSchedule: rxMethod<DoctorSchedule>(
      pipe(
        tap(() => {
          patchState(store, activateLoading);
          loader.start();
        }),
        switchMap((body) =>
          service.createDoctorSchedule(body).pipe(
            tap(() => {
              console.log('setting success true');
              patchState(store, setScheduleSuccess(true));
              console.log('setting succese',store.success());
              toast.showToast('Doctor slot has been added successfully', 'success');
            }),
            catchError(err => {
              const error = err.error.errors;
              patchState(
                store,
                setError(
                  error ?? 'Failed to add doctor slot'
                )
              );
              toast.showToast('Falied to add doctor slot', 'error');
              return of(null);
            }),

            finalize(() => {
              patchState(store, deactivateLoading);
              loader.stop()
            }))
        )
      )
    ),
    addDoctorBulkSchedule: rxMethod<DoctorScheduleBulk>(
      pipe(
        tap(() => {
          patchState(store, activateLoading);
          loader.start();
        }),
        switchMap((body) =>
          service.createBulkDoctorSchedule(body).pipe(
            tap(() => {
              patchState(store, setSuccess(true));
              toast.showToast('Doctor schedule has been added successfully', 'success');
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
    updateDoctorSchedule: rxMethod<UpdateSchedulePayload>(
      pipe(
        tap(() => {
          patchState(store, activateLoading);
          loader.start();
        }), switchMap(({ id, body }) =>
          service.updateDoctorSchedule(id, body).pipe(
            // tap(() => patchState(store, setError(''))),
            tap(() => {
              patchState(store, setSuccess(true));
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
          service.deleteDoctoSchedule(id).pipe(
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
