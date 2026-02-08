export interface ApiLookupResponse {
  success: boolean,
  message: string
  data: ApiLookup,
  errors: null | string[],
  innerException: null,
  statusCode: number,
  timestamp: string
  traceId: string
}

export interface Lookup {
  oid?: string,
  lookupCode: string,
  lookupNameAr: string,
  lookupNameEn: string,
  description: string,
  isSystem: boolean,
}

export interface ApiLookup {
  oid: string,
  lookupCode: string,
  lookupNameAr: string,
  lookupNameEn: string,
  description: string,
  isSystem: boolean,
  createdAt: string,
  updatedAt: string | null,
  lookupDetails: LookupDetail[]
}

export interface LookupDetail {
  oid: string,
  lookupMasterID: string,
  valueCode: string,
  valueNameAr: string,
  valueNameEn: string,
  sortOrder: number,
  isDefault: boolean,
  createdAt: string
  updatedAt: string | null,
  masterLookupCode: string
}
