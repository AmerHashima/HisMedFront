import { signalStore, withState } from "@ngrx/signals";
import { initialAppointmentState } from './appointment.slice';

export const AppointmentStore = signalStore(
  withState(initialAppointmentState),

  // withComputed(({ page, pageSize, search, sortBy, sortDirection, total }) => ({
  //   queryRequest: computed<RequestWrapper>(() => {
  //     const filters: Filter[] = [];

  //     if (search().trim()) {
  //       filters.push({
  //         propertyName: 'licenseNumber',
  //         value: search().trim(),
  //         operation: 3,
  //       });
  //     }

  //     const sort: Sort[] = [];

  //     if (sortBy() && sortDirection()) {
  //       sort.push({
  //         sortBy: sortBy(),
  //         sortDirection: sortDirection()!.toUpperCase(),
  //       });
  //     }

  //     const pagination: Pagination = {
  //       getAll: false,
  //       pageNumber: page() - 1,
  //       pageSize: pageSize(),
  //     };

  //     return createQueryRequest({
  //       filters,
  //       sort,
  //       pagination,
  //       columns: [],
  //     });
  //   }),

  //   // Optional: nicer API for template / debugging
  //   hasSearch: computed(() => !!search().trim()),
  //   isFirstPage: computed(() => page() <= 1),
  //   isLastPage: computed(() => {
  //     const loaded = page() * pageSize();
  //     return loaded >= total();
  //   }),
  // })),

  // withMethods((store, service = inject(DoctorService)) => ({
  //   queryDoctors: rxMethod<RequestWrapper>(
  //     pipe(
  //       debounceTime(300),
  //       tap(() => patchState(store, activateLoading)),
  //       switchMap(req =>
  //         service.search(req).pipe(
  //           tap(res => patchState(store, setDoctors(res.doctors, res.total))),
  //           catchError(err => {
  //             patchState(store, setError(err.message));
  //             return of({ doctors: [], total: 0 });
  //           }),
  //           finalize(() => patchState(store, deactivateLoading))
  //         )
  //       )
  //     )
  //   ),

  // })),
  // withMethods((store, service = inject(DoctorService)) => ({

  //   getDoctor: rxMethod<string>(
  //     pipe(
  //       tap(() => patchState(store, activateLoading)),
  //       switchMap(id =>
  //         service.getDoctor(id).pipe(
  //           tap(d => patchState(store, setSelectedDoctor(d))),
  //           catchError(err => {
  //             patchState(store, setError(err.message));
  //             return of(null);
  //           }),
  //           finalize(() => patchState(store, deactivateLoading))
  //         )
  //       )
  //     )
  //   ),

  //   addDoctor: rxMethod<Doctor>(
  //     pipe(
  //       tap(() => {
  //         patchState(store, activateLoading);
  //         //  patchState(store, setError(null))
  //       }),
  //       switchMap((body) =>
  //         service.createDoctor(body).pipe(
  //           // tap((user: ApiUser) => patchState(store, addUser(user))),
  //           tap(() => {
  //             patchState(store, setSuccess(true));
  //             store.queryDoctors(store.queryRequest());
  //           }),
  //           catchError((err) => {
  //             patchState(store, setError(err?.error.message ?? 'Failed to add doctor'));
  //             return EMPTY;
  //           }),
  //           finalize(() => patchState(store, deactivateLoading))
  //         )
  //       )
  //     )
  //   ),
  //   updateDoctor: rxMethod<UpdatePayload>(
  //     pipe(
  //       tap(() => { patchState(store, activateLoading); }),
  //       switchMap(({ id, body }) =>
  //         service.updateDoctor(id, body).pipe(
  //           // tap(() => patchState(store, setError(''))),
  //           tap(() => {
  //             patchState(store, setSuccess(true));
  //             store.queryDoctors(store.queryRequest());
  //           }),
  //           catchError((err) => {
  //             patchState(store, setError(err?.error.message ?? 'Failed to update doctor'));
  //             return EMPTY;
  //           }),
  //           finalize(() => patchState(store, deactivateLoading))
  //         )
  //       )
  //     )
  //   ),
  //   deleteDoctor: rxMethod<string>(
  //     pipe(
  //       switchMap(id =>
  //         service.deleteDoctor(id).pipe(
  //           tap(() => patchState(store, deleteDoctor(id))),
  //           catchError(err => {
  //             patchState(store, setError(err.message));
  //             return of(null);
  //           })
  //         )
  //       )
  //     )
  //   ),

  //   clearSort() {
  //     patchState(store, setSortUpdater("", ""));
  //   },
  //   setSuccess(success: boolean) {
  //     patchState(store, setSuccess(success));
  //   },
  //   setSearch(value: string) {
  //     patchState(store, setSearchUpdater(value));
  //   },

  //   setPage(page: number, pageSize?: number) {
  //     patchState(store, setPageUpdater(page, pageSize));
  //   },
  //   setSort(sort: { active: string; direction: 'asc' | 'desc' | '' }) {
  //     patchState(store, setSortUpdater(sort.active, sort.direction));
  //   },
  // })),

  // withHooks({
  //   onInit(store) {
  //     effect(() => {
  //       store.queryDoctors(store.queryRequest());
  //     });
  //   },
  // })
);
