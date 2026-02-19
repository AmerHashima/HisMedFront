// src\app\management\user\models\user-state.ts
import { User, UserVM } from "./user";

export interface UserState {
  // users: User[];
  // selectedUser: User | null;
  users: UserVM[];
  selectedUser: UserVM | null;
  success:boolean
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  total: number;
  search: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc' | '';
}
