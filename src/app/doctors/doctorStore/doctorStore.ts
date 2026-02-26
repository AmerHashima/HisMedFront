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
} from './doctor.updater';
import { Doctor } from '../models/doctor';
import { ToastingMessagesService } from 'src/app/common/service/toasting.service';

type UpdatePayload = {
  id: string;
  body: Doctor;
};

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

  withMethods((store, toast=inject(ToastingMessagesService),service = inject(DoctorService)) => ({
    queryDoctors: rxMethod<RequestWrapper>(
      pipe(
        debounceTime(300),
        tap(() => patchState(store, activateLoading)),
        switchMap(req =>
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

            finalize(() => patchState(store, deactivateLoading))
          )
        )
      )
    ),

  })),
  withMethods((store,toast=inject(ToastingMessagesService), service = inject(DoctorService)) => ({
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
        tap(() => patchState(store, activateLoading)),
        switchMap(id =>
          service.getDoctor(id).pipe(
            tap(d => patchState(store, setSelectedDoctor(d))),
            catchError(err => {
              const error = err.error.errors;
              patchState(
                store,
                setError(
                  error ?? 'Failed to get doctor'
                )
              );
              toast.showToast('Falied to retrieve doctor', 'error');

              return of(null);
            }),

            finalize(() => patchState(store, deactivateLoading))
          )
        )
      )
    ),

    addDoctor: rxMethod<Doctor>(
      pipe(
        tap(() => {
          patchState(store, activateLoading);
          //  patchState(store, setError(null))
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

            finalize(() => patchState(store, deactivateLoading))
          )
        )
      )
    ),
    updateDoctor: rxMethod<UpdatePayload>(
      pipe(
        tap(() => { patchState(store, activateLoading); }),
        switchMap(({ id, body }) =>
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
            finalize(() => patchState(store, deactivateLoading))
          )
        )
      )
    ),
    deleteDoctor: rxMethod<string>(
      pipe(
        switchMap(id =>
          service.deleteDoctor(id).pipe(
            tap(() => {patchState(store, deleteDoctor(id));
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

  withHooks({
    onInit(store) {
      effect(() => {
        store.queryDoctors(store.queryRequest());
      });
    },
  })
);
