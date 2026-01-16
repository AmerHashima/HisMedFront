import { PartialStateUpdater } from "@ngrx/signals";
import { UserState } from "../interface/user-state";

export const activateLoading: PartialStateUpdater<UserState> = (state) => ({
  loading: true,
});


export const deactivateLoading: PartialStateUpdater<UserState> = (state) => ({
  loading: false,
});

// export const updateError: PartialStateUpdater<UserState> = (state) => ({
//   error: 'Failed to load users'});


export const setError = (err: any): PartialStateUpdater<UserState> => {
  return () => ({error: err});
};
export const setUsers = (users: UserState['users']): PartialStateUpdater<UserState> => {
  return () => ({ users });
};
