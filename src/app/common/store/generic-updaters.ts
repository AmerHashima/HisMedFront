import { PartialStateUpdater } from '@ngrx/signals';
import { BaseCrudState } from '../Models/base-crud-state';
export const activateLoading =
  <T>() =>
    (): Partial<BaseCrudState<T>> => ({
      loading: true,
    });



export const deactivateLoading =
  <T>() =>
    (): Partial<BaseCrudState<T>> => ({
      loading: false,
    });

export const setError =
  <T>(error: string | null) =>
    (): Partial<BaseCrudState<T>> => ({
      error,
    });


export const setItems =
  <T>(items: T[], total: number) =>
    (): Partial<BaseCrudState<T>> => ({
      items,
      total,
    });

export const setSelectedItem =
  <T>(item: T) =>
    (): Partial<BaseCrudState<T>> => ({
      selectedItem: item,
    });

// export const clearSelectedItem =
//   <T>() =>
//     (): Partial<BaseCrudState<T>> => ({
//       selectedItem: null,
//     });

export const deleteItem =
  <T extends { oid: string }>(id: string) =>
    (state: BaseCrudState<T>) => ({
      items: state.items.filter(i => i.oid !== id),
    });

export const setSearchUpdater =
  <T>(search: string) =>
    (): Partial<BaseCrudState<T>> => ({
      search: search.trim(),
      page: 1,
    });

export const setPageUpdater =
  <T>(page: number, pageSize?: number) =>
    (state: BaseCrudState<T>) => ({
      page,
      pageSize: pageSize ?? state.pageSize,
    });

export const setSortUpdater =
  <T>(sortBy: string, direction: 'asc' | 'desc' | '') =>
    (): Partial<BaseCrudState<T>> => ({
      sortBy,
      sortDirection: direction,
      page: 1,
    });

export const setSuccess =
  <T>(success: boolean) =>
    (): Partial<BaseCrudState<T>> => ({
      success,
    });
