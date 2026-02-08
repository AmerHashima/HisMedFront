export interface ApiDocor {
  oid: string,
  userId: string,
  username: string,
  doctorFullName: string,
  licenseNumber: string,
  specialtyId: string,
  specialtyNameEn: string,
  specialtyNameAr: string,
  departmentLookupId: string,
  departmentName: string,
  branchId:string,
  branchName: string,
  nphiesProviderId: string,
  isNphiesEnabled: boolean,
  isActive: boolean,
  createdAt: string,
  updatedAt: string
}
