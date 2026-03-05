// src\app\patients\models\patient.ts
export interface PatientAddress {
  countryId: string;
  cityId: string;
  district: string;
  street: string;
  buildingNumber: string;
  postalCode: string;
  additionalNumber: string;
}

export interface PatientContact {
  contactName: string;
  relationshipId: string;
  mobile: string;
  phone: string;
  email: string;
}

export interface PatientAttachment {
  attachmentTypeId: string;
  fileName: string;
  filePath: string;
  fileExtension: string;
  fileSize: number;
}

export interface PatientInsurance {
  insuranceCompanyId: string;
  policyNumber: string;
  memberId: string;
  insuranceClass: string;
  startDate: string;
  expiryDate: string;
}

export interface Patient {
  oid?: string,
  identityTypeLookupId: string
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
  maritalStatusLookupId: string,
  bloodGroupLookupId: string,
  mobile: string,
  phone: string,
  email: string,
  branchId: string,
  addresses?: PatientAddress[],
  contacts?: PatientContact[],
  attachments?: PatientAttachment[],
  insurances?: PatientInsurance[]
}
