export interface ApiReponse {

  success: boolean,
  message: string,
  data: object | object[],
  errors: string[],
  innerException: string,
  statusCode: number,
  timestamp: string,
  traceId: string

}
