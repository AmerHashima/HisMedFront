export interface BaseCrudState<T> {
  items: T[];
  selectedItem: T | null;
  loading: boolean;
  error: string | null;
  search: string;
  page: number;
  pageSize: number;
  total: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc' | '';
  success: boolean;
}
