import { PartialStateUpdater } from "@ngrx/signals";
import { UserState } from "../models/user-state";
import { ApiUser } from "../models/api-user";
import { mapApiUsersToUsers, mapApiUserToUser, mapApiUsersToUserVMs, mapApiUserToUserVM } from "./user.mapper";
import { User, UserVM } from "../models/user";
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
  // const mappedUsers = mapApiUsersToUsers(users)
  const mappedUsers = mapApiUsersToUserVMs(users)

  return () => ({
    users: mappedUsers,
  });
};


// export const addUser = (
//   user: ApiUser
// ): PartialStateUpdater<UserState> => {
//   const mappedUser:User = mapApiUserToUser(user);
//   return (state) => ({
//     users: [...state.users, mappedUser],
//     newUser:true
//   });
// };

// export const updateUser = (
//   user: ApiUser
// ): PartialStateUpdater<UserState> => {
//   const mappedUser: User = mapApiUserToUser(user);
//   return (state) => ({
//     users: [
//       ...state.users.filter(u => u.oid !== mappedUser.oid),
//       mappedUser,
//     ],
//   });
// };


export const getUser = (
  user: ApiUser
): PartialStateUpdater<UserState> => {
  // const mappedUser: User = mapApiUserToUser(user);
  const mappedUser: UserVM = mapApiUserToUserVM(user);

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
  // const mappedUsers = mapApiUsersToUsers(users)
  const mappedUsers = mapApiUsersToUserVMs(users)
  return () => ({
    users: mappedUsers,
  });
};

export const setPageUpdater = (page: number, pageSize?:number): PartialStateUpdater<UserState> =>{
return (state) => ({
  page,
  pageSize: pageSize ?? state.pageSize,
});
}

export const setSuccess = (success: boolean): PartialStateUpdater<UserState> => {
  return (state) => ({
    success: success,
  });
};

export const setSearchUpdater = (value:string): PartialStateUpdater<UserState> => {
  return (state) => ({
    search: value.trim(),
    page: 1,
  });
}

export const setSortUpdater = (active: string, direction: 'asc' | 'desc' | ''): PartialStateUpdater<UserState> => {
  return (state) => ({
    sortBy: active || "",
    sortDirection: direction || "",
    page: 1,
  });
}
