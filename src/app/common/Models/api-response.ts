// src\app\common\Models\api-response.ts
export interface ApiResponse<T> {

  success: boolean,
  message: string,
  data: T,
  errors: string[],
  innerException: string,
  statusCode: number,
  timestamp: string,
  traceId: string
}


export interface ApiSearchResponse<T> {

  success: boolean,
  message: string,
  data: PaginatedData<T>;
  errors: string[],
  innerException: string,
  statusCode: number,
  timestamp: string,
  traceId: string
}



export interface PaginatedData<T> {
  data: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  metadata?: Record<string, string>;
}

