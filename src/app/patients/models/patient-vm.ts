import { Patient } from "./patient";

export interface PatientVM extends Patient {
  mrn: string;

  fullNameAr: string;
  fullNameEn: string;

  identityTypeName: string;
  genderName: string;
  nationalityName: string;
  maritalStatusName: string;
  bloodGroupName: string;

  branchName: string;

  age: number;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}
