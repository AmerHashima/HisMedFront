import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { initialUsersState } from './user.slice';
import {
  activateLoading, deactivateLoading, setUsers, setError,
  addUser, updateUser, getUser, deleteUser, displaySearchResult
} from "./store.updaters";
import UserService from '../service/user.service';
import { inject } from '@angular/core';
import { catchError, finalize, of, tap } from 'rxjs';
import { User } from '../models/user';
import { ApiUser } from '../models/api-user';
import { RequestWrapper } from '../../../common/Models/request';

export const UsersStore = signalStore(
  // { providedIn: 'root' },
  withState(initialUsersState),
  withMethods((store) => {
    const userService = inject(UserService);
    return {
      loadUsers: () => {
        patchState(store, activateLoading);

        return userService.getUsers().pipe(
          tap((users: ApiUser[]) => {
            patchState(store, setUsers(users));
          }),
          catchError((err) => {
            patchState(store, setError(err.msg));
            return of([]);
          }),

          finalize(() => {
            patchState(store, deactivateLoading);
          })
        );
      },
      addUser: (body: User) => {
        patchState(store, activateLoading);
        return userService.createUser(body).pipe(
          tap((user: ApiUser) => patchState(store, addUser(user))),
          catchError((err) => {
            patchState(store, setError(err.msg));
            return of([]);
          }),
          finalize(() => patchState(store, deactivateLoading))
        );
      },
      updateUser: (id: string, body: User) => {
        patchState(store, activateLoading);
        return userService.updateUser(id, body).pipe(
          tap((user: ApiUser) => patchState(store, updateUser(user))),
          catchError((err) => {
            patchState(store, setError(err.msg));
            return of([]);
          }),
          finalize(() => patchState(store, deactivateLoading))
        );
      },
      getUser: (id: string) => {
        patchState(store, activateLoading);
        return userService.getUser(id).pipe(
          tap((user: ApiUser) => patchState(store, getUser(user))),
          catchError((err) => {
            patchState(store, setError(err.msg));
            return of([]);
          }),
          finalize(() => patchState(store, deactivateLoading))
        );
      },
      deleteUser: (id: string) => {
        patchState(store, activateLoading);
        return userService.deleteUser(id).pipe(
          tap((user: string) => patchState(store, deleteUser(id))),
          catchError((err) => {
            patchState(store, setError(err.msg));
            return of([]);
          }),
          finalize(() => patchState(store, deactivateLoading))
        );
      },
      queryUsers: (body: RequestWrapper) => {
        patchState(store, activateLoading);
        return userService.search(body).pipe(
          tap((users: ApiUser[]) => patchState(store, displaySearchResult(users))),
          catchError((err) => {
            patchState(store, setError(err.msg));
            return of([]);
          }),
          finalize(() => patchState(store, deactivateLoading))
        );
      }

    };
  })
);
