// src\app\management\user\userStore\userStore.ts
import { signalStore, withState, withMethods, patchState, withHooks, withComputed } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { initialUsersState } from './user.slice';
import {
  activateLoading, deactivateLoading, setUsers, setError,
  getUser, deleteUser,
  setSearchUpdater,
  setPageUpdater,
  setSortUpdater,
  setSuccess
} from "./store.updaters";
import UserService from '../service/user.service';
import { computed, effect, inject } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, finalize, of, pipe, switchMap, tap } from 'rxjs';
import { User, UserVM } from '../models/user';
import { ApiUser } from '../models/api-user';
import { Filter, Pagination, RequestWrapper, Sort } from '../../../common/Models/request';
import { createQueryRequest } from './store.helpers';
import { ToastingMessagesService } from 'src/app/common/service/toasting.service';
import { LoadingService } from 'src/app/common/service/loading.service';

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
    setSuccess(success: boolean) {
      patchState(store, setSuccess(success));
    },

  })),
  withMethods((store, loader = inject(LoadingService), toast = inject(ToastingMessagesService), userService = inject(UserService)) => ({
    queryUsers: rxMethod<RequestWrapper>(
      pipe(
        debounceTime(350),
        // distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        tap(() => {
          patchState(store, activateLoading);
          loader.start();
        }),
        switchMap((request: RequestWrapper) =>
          userService.search(request).pipe(
            tap((response: { users: ApiUser[]; total: number }) => {
              patchState(store, (s) => ({
                ...s,
                users: response.users,
                total: response.total ?? 0
              }));
            }),
            catchError(err => {
              const error = err.error.errors;
              patchState(
                store,
                setError(
                  error ?? 'Failed to query users'
                )
              );
              toast.showToast('Falied to search user', 'error');

              return of({ users: [], total: 0 });
            }),
            finalize(() => {
              patchState(store, deactivateLoading);
              loader.stop()
            })
          )
        )
      )
    ),

  })),
  withMethods((store) => {
    const userService = inject(UserService);
    const toast = inject(ToastingMessagesService);
    const loader = inject(LoadingService);
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
      clearSelectedItem: rxMethod<void>(
        pipe(
          tap(() => {
            patchState(store, {
              selectedUser: null
            });
          })
        )
      ),
      addUser: rxMethod<User>(
        pipe(
          tap(() => {
            patchState(store, activateLoading);
            loader.start();
          }),
          switchMap((body) =>
            userService.createUser(body).pipe(
              // tap((user: ApiUser) => patchState(store, addUser(user))),
              tap(() => {
                patchState(store, setSuccess(true));
                toast.showToast('User has been added successfully', 'success');

                store.queryUsers(store.queryRequest());
              }),
              catchError(err => {
                const error = err.error.errors;
                patchState(
                  store,
                  setError(
                    error ?? 'Failed to add user'
                  )
                );
                toast.showToast('Falied to add user', 'error');
                return EMPTY
              }),

              finalize(() => {
                patchState(store, deactivateLoading);
                loader.stop()
              }))
          )
        )
      ),
      updateUser: rxMethod<UpdateUserPayload>(
        pipe(
          tap(() => {
            patchState(store, activateLoading);
            loader.start();
          }), switchMap(({ id, body }) =>
            userService.updateUser(id, body).pipe(
              // tap(() => patchState(store, setError(''))),
              tap(() => {
                patchState(store, setSuccess(true));
                toast.showToast('User has been updated successfully', 'success');

                store.queryUsers(store.queryRequest());
              }),
              catchError(err => {
                const error = err.error.errors;
                patchState(
                  store,
                  setError(
                    error ?? 'Failed to update user'
                  )
                );
                toast.showToast('Falied to updated user', 'error');

                return EMPTY
              }),

              finalize(() => {
                patchState(store, deactivateLoading);
                loader.stop()
              }))
          )
        )
      ),
      getUser: rxMethod<string>(
        pipe(
          tap(() => {
            patchState(store, activateLoading);
            loader.start();
          }), switchMap((id) =>
            userService.getUser(id).pipe(
              tap((user: ApiUser) => patchState(store, getUser(user))),
              catchError(err => {
                const error = err.error.errors;
                patchState(
                  store,
                  setError(
                    error ?? 'Failed to load user'
                  )
                );
                toast.showToast('Falied to retrieve user', 'error');

                return EMPTY
              }),
              finalize(() => {
                patchState(store, deactivateLoading);
                loader.stop()
              }))
          )
        )
      ),
      deleteUser: rxMethod<string>(
        pipe(
          tap(() => {
            patchState(store, activateLoading);
            loader.start();
          }), switchMap((id) =>
            userService.deleteUser(id).pipe(
              tap(() => {
                patchState(store, deleteUser(id));
                toast.showToast('User has been deleted successfully', 'success');

              }),
              catchError(err => {
                const error = err.error.errors;
                patchState(
                  store,
                  setError(
                    error ?? 'Failed to delete user'
                  )
                );
                toast.showToast('Falied to delete user', 'error');
                return EMPTY
              }),
              finalize(() => {
                patchState(store, deactivateLoading);
                loader.stop()
              }))
          )
        )
      )
    };
  }),

  withHooks({
    onInit(store) {
      effect(() => {
        const req = store.queryRequest();
        store.queryUsers(req);
      });
    },
  })
);


