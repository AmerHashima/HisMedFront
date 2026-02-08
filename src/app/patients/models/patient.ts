export interface Patient {
  oid?:string,
  identityTypeLookupId:string
  identityNumber: string,
  firstNameAr: string,
  middleNameAr: string,
  lastNameAr: string,
  firstNameEn: string,
  middleNameEn: string,
  lastNameEn: string,
  genderLookupId: string,
  birthDate: string,
  nationalityLookupId: string,
  maritalStatusLookupId:string,
  bloodGroupLookupId: string,
  mobile: string,
  phone: string,
  email: string,
  branchId:string
}
