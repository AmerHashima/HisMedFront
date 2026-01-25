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
