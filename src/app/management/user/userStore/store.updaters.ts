import { PartialStateUpdater } from "@ngrx/signals";
import { UserState } from "../models/user-state";
import { ApiUser } from "../models/api-user";
import { mapApiUsersToUsers, mapApiUserToUser } from "./user.mapper";
import { User } from "../models/user";
export const activateLoading: PartialStateUpdater<UserState> = (state) => ({
  loading: true,
});


export const deactivateLoading: PartialStateUpdater<UserState> = (state) => ({
  loading: false,
});




export const setError = (err: any): PartialStateUpdater<UserState> => {
  return () => ({ error: err });
};
export const setUsers = (users: ApiUser[]): PartialStateUpdater<UserState> => {
  const mappedUsers = mapApiUsersToUsers(users)
  return () => ({
    users: mappedUsers,
  });
};


export const addUser = (
  user: ApiUser
): PartialStateUpdater<UserState> => {
  const mappedUser:User = mapApiUserToUser(user);
  return (state) => ({
    users: [...state.users, mappedUser],
  });
};

export const updateUser = (
  user: ApiUser
): PartialStateUpdater<UserState> => {
  const mappedUser: User = mapApiUserToUser(user);

  return (state) => ({
    users: [
      ...state.users.filter(u => u.oid !== mappedUser.oid),
      mappedUser,
    ],
  });
};


export const getUser = (
  user: ApiUser
): PartialStateUpdater<UserState> => {
  const mappedUser: User = mapApiUserToUser(user);

  return () => ({
    selectedUser:mappedUser
  });
};


export const deleteUser = (
  id: string
): PartialStateUpdater<UserState> => {

  return (state) => ({
    users: [
      ...state.users.filter(u => u.oid !== id),
    ],
  });
};


export const displaySearchResult = (users: ApiUser[]): PartialStateUpdater<UserState> => {
  const mappedUsers = mapApiUsersToUsers(users)
  return () => ({
    users: mappedUsers,
  });
};
