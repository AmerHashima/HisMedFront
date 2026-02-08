import { ApiDocor } from '../models/api-docor';
import { Doctor } from '../models/doctor';

export function mapApiDoctorToDoctor(api: ApiDocor): Doctor {
  return {
    oid: api.oid,
    userId: api.userId,
    licenseNumber: api.licenseNumber,
    specialtyId: api.specialtyId,
    departmentLookupId: api.departmentLookupId,
    branchId: api.branchId,
    nphiesProviderId: api.nphiesProviderId,
    isNphiesEnabled: api.isNphiesEnabled,
    isActive: api.isActive,
  };
}

export function mapApiDoctorToDoctorVM(api: ApiDoctor): DoctorVM {
  return {
    oid: api.oid,
    userId: api.userId,
    licenseNumber: api.licenseNumber,
    specialtyId: api.specialtyId,
    departmentLookupId: api.departmentLookupId,
    branchId: api.branchId,
    nphiesProviderId: api.nphiesProviderId,
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

export function mapApiPatientToPatientVM(api: ApiPatient): PatientVM {
  return {
    oid: api.oid,
    identityTypeLookupId: api.identityTypeLookupId,
    identityNumber: api.identityNumber,
    firstNameAr: api.firstNameAr,
    middleNameAr: api.middleNameAr,
    lastNameAr: api.lastNameAr,
    firstNameEn: api.firstNameEn,
    middleNameEn: api.middleNameEn,
    lastNameEn: api.lastNameEn,
    genderLookupId: api.genderLookupId,
    birthDate: api.birthDate,
    nationalityLookupId: api.nationalityLookupId,
    maritalStatusLookupId: api.maritalStatusLookupId,
    bloodGroupLookupId: api.bloodGroupLookupId,
    mobile: api.mobile,
    phone: api.phone,
    email: api.email,
    branchId: api.branchId,

    mrn: api.mrn,
    fullNameAr: api.fullNameAr,
    fullNameEn: api.fullNameEn,
    identityTypeName: api.identityTypeName,
    genderName: api.genderName,
    nationalityName: api.nationalityName,
    maritalStatusName: api.maritalStatusName,
    bloodGroupName: api.bloodGroupName,
    branchName: api.branchName,

    age: api.age,
    isActive: api.isActive,

    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}
export const mapApiDoctorsToDoctors = (doctors: ApiDocor[]): Doctor[] =>
  doctors.map(mapApiDoctorToDoctor);
