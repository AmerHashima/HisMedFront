import { Doctor } from "./doctor";

export interface DoctorVM extends Doctor {
  username: string;
  doctorFullName: string;

  specialtyNameEn: string;
  specialtyNameAr: string;

  departmentName: string;
  branchName: string;

  createdAt: string;
  updatedAt: string;
}
