// src\app\doctors\doctorStore\doctor.mapper.ts
import { ApiDocor } from '../models/api-docor';
import { Doctor } from '../models/doctor';
import { DoctorVM } from '../models/doctor-vm';

export function mapApiDoctorToDoctor(api: ApiDocor): Doctor {
  return {
    oid: api.oid,
    userId: api.userId,
    firstNameAr: api.firstNameAr ?? '',
    middleNameAr: api.middleNameAr ?? '',
    lastNameAr: api.lastNameAr ?? '',
    firstNameEn: api.firstNameEn ?? '',
    middleNameEn: api.middleNameEn ?? '',
    lastNameEn: api.lastNameEn ?? '',
    genderId: api.genderId ?? '',
    licenseNumber: api.licenseNumber,
    licenseTypeId: api.licenseTypeId ?? '',
    licenseIssueDate: api.licenseIssueDate ?? '',
    licenseExpiryDate: api.licenseExpiryDate ?? '',
    specialtyId: api.specialtyId,
    subSpecialtyId: api.subSpecialtyId ?? '',
    departmentId: api.departmentId ?? api.departmentLookupId,
    mobile: api.mobile ?? '',
    phone: api.phone ?? '',
    email: api.email ?? '',
    yearsOfExperience: api.yearsOfExperience ?? 0,
    consultationFee: api.consultationFee ?? 0,
    branchId: api.branchId,
    nphiesProviderId: api.nphiesProviderId ?? '',
    nphiesLicenseNumber: api.nphiesLicenseNumber ?? '',
    isNphiesEnabled: api.isNphiesEnabled,
    isActive: api.isActive,
  };
}

export function mapApiDoctorToDoctorVM(api: ApiDocor): DoctorVM {
  return {
    oid: api.oid,
    userId: api.userId,
    firstNameAr: api.firstNameAr ?? '',
    middleNameAr: api.middleNameAr ?? '',
    lastNameAr: api.lastNameAr ?? '',
    firstNameEn: api.firstNameEn ?? '',
    middleNameEn: api.middleNameEn ?? '',
    lastNameEn: api.lastNameEn ?? '',
    genderId: api.genderId ?? '',
    licenseNumber: api.licenseNumber,
    licenseTypeId: api.licenseTypeId ?? '',
    licenseIssueDate: api.licenseIssueDate ?? '',
    licenseExpiryDate: api.licenseExpiryDate ?? '',
    specialtyId: api.specialtyId,
    subSpecialtyId: api.subSpecialtyId ?? '',
    departmentId: api.departmentId ?? api.departmentLookupId,
    mobile: api.mobile ?? '',
    phone: api.phone ?? '',
    email: api.email ?? '',
    yearsOfExperience: api.yearsOfExperience ?? 0,
    consultationFee: api.consultationFee ?? 0,
    branchId: api.branchId,
    nphiesProviderId: api.nphiesProviderId ?? '',
    nphiesLicenseNumber: api.nphiesLicenseNumber ?? '',
    isNphiesEnabled: api.isNphiesEnabled,
    isActive: api.isActive,

    username: api.username,
    doctorFullName: api.doctorFullName,
    specialtyNameEn: api.specialtyNameEn,
    specialtyNameAr: api.specialtyNameAr,
    departmentName: api.departmentName,
    branchName: api.branchName,

    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}


export const mapApiDoctorsToDoctors = (doctors: ApiDocor[]): Doctor[] =>
  doctors.map(mapApiDoctorToDoctor);


export const mapApiDoctorsToDoctorVMs = (doctors: ApiDocor[]) =>
  doctors.map(mapApiDoctorToDoctorVM);
