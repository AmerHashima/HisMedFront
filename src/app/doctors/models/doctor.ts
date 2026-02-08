export interface Doctor {
  oid?:string,
  userId: string,
  licenseNumber: string,
  specialtyId: string,
  departmentLookupId: string,
  branchId: string,
  nphiesProviderId: string,
  isNphiesEnabled: boolean,
  isActive: boolean
}
