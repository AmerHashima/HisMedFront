import { signalStore, withState, withMethods, withHooks, withComputed, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { inject, computed, effect } from '@angular/core';
import { debounceTime, switchMap, tap, catchError, of, finalize, pipe, EMPTY } from 'rxjs';

import { PatientService } from '../service/patient.service';
import { initialPatientState } from './patient.slice';

import { createQueryRequest } from 'src/app/management/user/userStore/store.helpers';
import { Filter, Pagination, RequestWrapper, Sort } from 'src/app/common/Models/request';
import {
  activateLoading, setPatients, setError, deactivateLoading,
  setSelectedPatient, setSearchUpdater, setSortUpdater, setPageUpdater, deletePatient,
  setSuccess
} from './patient.updater';
import { Patient } from '../models/patient';
type UpdatePayload = {
  id: string;
  body: Patient;
};

export const PatientStore = signalStore(
  withState(initialPatientState),

  withComputed(({ page, pageSize, search, sortBy, sortDirection, total }) => ({
    queryRequest: computed<RequestWrapper>(() => {
      const filters: Filter[] = [];

      if (search().trim()) {
        filters.push({
          propertyName: 'mrn',
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

  withMethods((store, service = inject(PatientService)) => ({
    queryPatients: rxMethod<RequestWrapper>(
      pipe(
        debounceTime(300),
        tap(() => patchState(store, activateLoading)),
        switchMap(req =>
          service.search(req).pipe(
            tap(res => patchState(store, setPatients(res.patients, res.total))),
                catchError(err => {
                            const error = err.error.errors;
                            patchState(
                              store,
                              setError(
                                error ?? 'Failed to query patient'
                              )
                            );
                  return of({ patients: [], total: 0 });
                          }),

            finalize(() => patchState(store, deactivateLoading))
          )
        )
      )
    ),

  })),
  withMethods((store, service = inject(PatientService)) => ({
    clearSelectedItem: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, {
            selectedPatient: null
          });
        })
      )
    ),
    addPatient: rxMethod<Patient>(
      pipe(
        tap(() => {
          patchState(store, activateLoading);
          //  patchState(store, setError(null))
        }),
        switchMap((body) =>
          service.createPatient(body).pipe(
            // tap((user: ApiUser) => patchState(store, addUser(user))),
            tap(() => {
              patchState(store, setSuccess(true));
              store.queryPatients(store.queryRequest());
            }),
            catchError(err => {
              const error = err.error.errors;
              patchState(
                store,
                setError(
                  error ?? 'Failed to add patient'
                )
              );
              return EMPTY;
            }),

            finalize(() => patchState(store, deactivateLoading))
          )
        )
      )
    ),
    updatePatient: rxMethod<UpdatePayload>(
      pipe(
        tap(() => { patchState(store, activateLoading); }),
        switchMap(({ id, body }) =>
          service.updatePatient(id, body).pipe(
            // tap(() => patchState(store, setError(''))),
            tap(() => {
              patchState(store, setSuccess(true));
              store.queryPatients(store.queryRequest());
            }),
            catchError(err => {
              const error = err.error.errors;
              patchState(
                store,
                setError(
                  error ?? 'Failed to update patient'
                )
              );
              return EMPTY;
            }),

            finalize(() => patchState(store, deactivateLoading))
          )
        )
      )
    ),
    getPatient: rxMethod<string>(
      pipe(
        tap(() => patchState(store, activateLoading)),
        switchMap(id =>
          service.getPatient(id).pipe(
            tap(p => patchState(store, setSelectedPatient(p))),
            catchError(err => {
              const error = err.error.errors;
              patchState(
                store,
                setError(
                  error ?? 'Failed to get patient'
                )
              );
              return of(null);
            }),
            finalize(() => patchState(store, deactivateLoading))
          )
        )
      )
    ),

    deletePatient: rxMethod<string>(
      pipe(
        switchMap(id =>
          service.deletePatient(id).pipe(
            tap(() => patchState(store, deletePatient(id))),
            catchError(err => {
              const error = err.error.errors;
              patchState(
                store,
                setError(
                  error ?? 'Failed to delete patient'
                )
              );
              return of(null);
            }),
          )
        )
      )
    ),

    setSearch(value: string) {
      patchState(store, setSearchUpdater(value));
    },

    setPage(page: number, pageSize?: number) {
      patchState(store, setPageUpdater(page, pageSize));
    },

    setSort(sort: { active: string; direction: 'asc' | 'desc' | '' }) {
        patchState(store, setSortUpdater(sort.active, sort.direction));
      },
    clearSort() {
      patchState(store, setSortUpdater("", ""));
    },
    setSuccess(success: boolean) {
      patchState(store, setSuccess(success));
    },
  })),

  withHooks({
    onInit(store) {
      effect(() => {
        store.queryPatients(store.queryRequest());
      });
    },
  })
);
