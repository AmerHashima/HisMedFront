import { RequestBody, RequestWrapper } from "../../../common/Models/request";

export function createQueryRequest({
  filters = [],
  sort = [],
  pagination = { getAll: true, pageNumber: 0, pageSize: 0 },
  columns = []
}: RequestBody): RequestWrapper {
  return {
    request: {
      filters,
      sort,
      pagination,
      columns
    }
  };
}
