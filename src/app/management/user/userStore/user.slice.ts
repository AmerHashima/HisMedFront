import { UserState } from "../interface/user-state";

export const initialUsersState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,

  page: 1,
  pageSize: 10,
  total: 0,

  search: ''
};
