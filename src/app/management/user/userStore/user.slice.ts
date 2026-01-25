import { UserState } from "../models/user-state";
import { User } from '../models/user';

export const initialUsersState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,

  page: 1,
  pageSize: 10,
  total: 0,

  search: '',
  sortBy: 'username',
  sortDirection: 'asc',
};
