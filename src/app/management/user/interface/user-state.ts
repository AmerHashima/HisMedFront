import { User } from "./user";

export interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  total: number;

  search: string;
}
