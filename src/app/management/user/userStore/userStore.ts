import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { initialUsersState } from './user.slice';
import { activateLoading, deactivateLoading, setUsers,setError } from "./store.updaters";
import  UserService  from '../service/user.service';
import { inject } from '@angular/core';
import { catchError, finalize, of, tap } from 'rxjs';
import { User } from '../interface/user';
export const UsersStore = signalStore(
  // { providedIn: 'root' },
  withState(initialUsersState),
  withMethods((store) => {
    const userService = inject(UserService);

    return {
      loadUsers: () => {
        patchState(store, activateLoading);
        return userService.getUsers().pipe(
          tap((users) => patchState(store, setUsers(users as User[]))),
          catchError(() => {
            patchState(store, setError('Failed to load Users'));
            return of([]);
          }),
          finalize(() => patchState(store, deactivateLoading))
        );
      },
    };
  })
);
