import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { initialAppointmentState } from './appointment.slice';
import { Appointment, AppointmentVM } from "../../models/appointment";
import { computed, inject } from "@angular/core";
import { Filter, Pagination, RequestWrapper, Sort } from "src/app/common/Models/request";
import { createQueryRequest } from "src/app/management/user/userStore/store.helpers";
import { AppointmentService } from "../../Services/appointment.service";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { catchError, debounceTime, EMPTY, finalize, of, pipe, switchMap, tap } from "rxjs";
import { activateLoading, deactivateLoading, deleteItem, setError, setItems, setPageUpdater, setSearchUpdater, setSelectedItem, setSortUpdater, setSuccess } from "src/app/common/store/generic-updaters";
import { mapApiAppointmentToAppointmentVM } from "./appointment.mapper";

type UpdatePayload = {
  id: string;
  body: Appointment;
};
export const AppointmentStore = signalStore(
  withState(initialAppointmentState),

  withComputed(({ page, pageSize, search, sortBy, sortDirection, total }) => ({
    queryRequest: computed<RequestWrapper>(() => {

      const filters: Filter[] = [];
      if (search().trim()) {
        filters.push({
          propertyName: 'appointmentType',
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

  // withMethods((store, service = inject(AppointmentService)) => ({
  //   // 🔎 SEARCH
  //   queryAppointments: rxMethod<RequestWrapper>(
  //     pipe(
  //       debounceTime(300),
  //       tap(() => patchState(store, activateLoading<AppointmentVM>())),
  //       switchMap(req =>
  //         service.search(req).pipe(
  //           tap(res =>
  //             patchState(store,
  //               setItems<AppointmentVM>(mapApiAppointmentsToAppointmentVMs(res.appointments), res.total)
  //             )
  //           ),
  //           catchError(err => {
  //             patchState(store, setError<AppointmentVM>(err.message));
  //             return of({ appointments: [], total: 0 });
  //           }),
  //           finalize(() => patchState(store, deactivateLoading<AppointmentVM>()))
  //         )
  //       )
  //     )
  //   ),

  // })),

  withMethods((store, service = inject(AppointmentService)) => ({


    // 📄 GET BY ID
    getAppointment: rxMethod<string>(
      pipe(
        tap(() => patchState(store, activateLoading<AppointmentVM>())),
        switchMap(id =>
          service.getAppointment(id).pipe(
            tap(apiAppointment =>
              patchState(store, setSelectedItem<AppointmentVM>(mapApiAppointmentToAppointmentVM(apiAppointment)))
            ),
            catchError(err => {
              patchState(store, setError<AppointmentVM>(err.message));
              return of(null);
            }),
            finalize(() => patchState(store, deactivateLoading<AppointmentVM>()))
          )
        )
      )
    ),

    // ➕ ADD
    addAppointment: rxMethod<Appointment>(
      pipe(
        tap(() => patchState(store, activateLoading<AppointmentVM>())),
        switchMap(body =>
          service.createAppointment(body).pipe(
            tap(() => {
              patchState(store, setSuccess<AppointmentVM>(true));
              console.log('update appointment');
              // store.queryAppointments(store.queryRequest());
            }),
            catchError(err => {
              patchState(store, setError<AppointmentVM>(err?.error?.message ?? 'Failed to add appointment'));
              return EMPTY;
            }),
            finalize(() => patchState(store, deactivateLoading<AppointmentVM>()))
          )
        )
      )
    ),

    // ✏ UPDATE
    updateAppointment: rxMethod<UpdatePayload>(
      pipe(
        tap(() => patchState(store, activateLoading<AppointmentVM>())),
        switchMap(({ id, body }) =>
          service.updateAppointment(id, body).pipe(
            tap(() => {
              patchState(store, setSuccess<AppointmentVM>(true));
              console.log('update appointment');

              // store.queryAppointments(store.queryRequest());
            }),
            catchError(err => {
              patchState(store, setError<AppointmentVM>(err?.error?.message ?? 'Failed to update appointment'));
              return EMPTY;
            }),
            finalize(() => patchState(store, deactivateLoading<AppointmentVM>()))
          )
        )
      )
    ),

    // ❌ DELETE
    deleteAppointment: rxMethod<string>(
      pipe(
        switchMap(id =>
          service.getAppointment(id).pipe(
            tap(() => patchState(store, deleteItem<AppointmentVM>(id))),
            catchError(err => {
              patchState(store, setError<AppointmentVM>(err.message));
              return of(null);
            })
          )
        )
      )
    ),

    // 🎛 UI HELPERS
    setSearch(value: string) {
      patchState(store, setSearchUpdater<AppointmentVM>(value));
    },

    setPage(page: number, pageSize?: number) {
      patchState(store, setPageUpdater<AppointmentVM>(page, pageSize));
    },

    setSort(sort: { active: string; direction: 'asc' | 'desc' | '' }) {
      patchState(store, setSortUpdater<AppointmentVM>(sort.active, sort.direction));
    },

    clearSort() {
      patchState(store, setSortUpdater<AppointmentVM>("", ""));
    },

    setSuccess(success: boolean) {
      patchState(store, setSuccess<AppointmentVM>(success));
    },

  })),

  // withHooks({
  //   onInit(store) {
  //     effect(() => {
  //       store.queryAppointments(store.queryRequest());
  //     });
  //   },
  // })
);
