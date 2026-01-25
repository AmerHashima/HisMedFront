import { signalStore, withState, withMethods, patchState, withHooks, withComputed } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { initialUsersState } from './user.slice';
import {
  activateLoading, deactivateLoading, setUsers, setError,
  addUser, updateUser, getUser, deleteUser, displaySearchResult,
  setSearchUpdater,
  setPageUpdater,
  setSortUpdater
} from "./store.updaters";
import UserService from '../service/user.service';
import { computed, effect, inject } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, finalize, of, pipe, switchMap, tap } from 'rxjs';
import { User } from '../models/user';
import { ApiUser } from '../models/api-user';
import { Filter, Pagination, RequestWrapper, Sort } from '../../../common/Models/request';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { createQueryRequest } from './store.helpers';
import { active } from 'sortablejs';

type UpdateUserPayload = {
  id: string;
  body: User;
};

export const UsersStore = signalStore(
  // { providedIn: 'root' },
  withState(initialUsersState),
  withComputed(({ page, pageSize, search, sortBy, sortDirection, total }) => ({
    queryRequest: computed<RequestWrapper>(() => {
      const filters: Filter[] = [];

      if (search().trim()) {
        filters.push({
          propertyName: 'username',
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
  withMethods((store) => ({
    setPage(page: number, pageSize?: number) {
      patchState(store, setPageUpdater(page, pageSize));
    },

    setSearch(value: string) {
      patchState(store, setSearchUpdater(value));
    },

    setSort(sort: { active: string; direction: 'asc' | 'desc' | '' }) {
      patchState(store, setSortUpdater(sort.active, sort.direction));
    },
    clearSort() {
      patchState(store, setSortUpdater("", ""));
    },
  })),
  withMethods((store, userService = inject(UserService)) => ({
    queryUsers: rxMethod<RequestWrapper>(
      pipe(
        debounceTime(350),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        tap(() => patchState(store, activateLoading)),
        switchMap((request: RequestWrapper) =>
          userService.search(request).pipe(
            tap((response: { users: ApiUser[]; total: number }) => {
              patchState(store, (s) => ({
                ...s,
                users:response.users,
                total: response.total ?? 0
              }));
            }),
            catchError((err) => {
              patchState(store, setError(err.message || 'Failed to load users'));
              return of({ users: [], total: 0 }); // match return type
            }),
            finalize(() => patchState(store, deactivateLoading))
          )
        )
      )
    ),

  })),
  withMethods((store) => {
    const userService = inject(UserService);
    return {
      // loadUsers: () => {
      //   patchState(store, activateLoading);

      //   return userService.getUsers().pipe(
      //     tap((users: ApiUser[]) => {
      //       patchState(store, setUsers(users));
      //     }),
      //     catchError((err) => {
      //       patchState(store, setError(err.msg));
      //       return EMPTY;
      //     }),

      //     finalize(() => {
      //       patchState(store, deactivateLoading);
      //     })
      //   );
      // },
      addUser: rxMethod<User>(
        pipe(
          tap(() => patchState(store, activateLoading)),
          switchMap((body) =>
            userService.createUser(body).pipe(
              tap((user: ApiUser) => patchState(store, addUser(user))),
              catchError((err) => {
                patchState(store, setError(err?.msg ?? 'Failed to add user'));
                return EMPTY;
              }),
              finalize(() => patchState(store, deactivateLoading))
            )
          )
        )
      ),
      updateUser: rxMethod<UpdateUserPayload>(
        pipe(
          tap(() => patchState(store, activateLoading)),
          switchMap(({ id, body }) =>
            userService.updateUser(id, body).pipe(
              tap((user: ApiUser) => patchState(store, updateUser(user))),
              catchError((err) => {
                patchState(store, setError(err?.msg ?? 'Failed to update user'));
                return EMPTY;
              }),
              finalize(() => patchState(store, deactivateLoading))
            )
          )
        )
      ),
      getUser: rxMethod<string>(
        pipe(
          tap(() => patchState(store, activateLoading)),
          switchMap((id) =>
            userService.getUser(id).pipe(
              tap((user: ApiUser) => patchState(store, getUser(user))),
              catchError((err) => {
                patchState(store, setError(err?.msg ?? 'Failed to load user'));
                return EMPTY;
              }),
              finalize(() => patchState(store, deactivateLoading))
            )
          )
        )
      ),
      deleteUser: rxMethod<string>(
        pipe(
          tap(() => patchState(store, activateLoading)),
          switchMap((id) =>
            userService.deleteUser(id).pipe(
              tap(() => patchState(store, deleteUser(id))),
              catchError((err) => {
                patchState(store, setError(err.message || 'Delete failed'));
                return EMPTY
              }),
              finalize(() => patchState(store, deactivateLoading))
            )
          )
        )
      )
    };
  }),

  withHooks({
    onInit(store) {
      effect(() => {
        const req = store.queryRequest();
        console.log('in effect');
        store.queryUsers(req);
      });
    },
  })
  // withHooks({
  //   onInit(store) {
  //     store.loadUsers()
  //       .pipe(takeUntilDestroyed())
  //       .subscribe();
  //   }
  // })
);


