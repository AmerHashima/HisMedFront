import { ApiDocor } from '../models/api-docor';
import { Doctor } from '../models/doctor';
import { DoctorVM } from '../models/doctor-vm';

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

export function mapApiDoctorToDoctorVM(api: ApiDocor): DoctorVM {
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


export const mapApiDoctorsToDoctors = (doctors: ApiDocor[]): Doctor[] =>
  doctors.map(mapApiDoctorToDoctor);


export const mapApiDoctorsToDoctorVMs = (doctors: ApiDocor[]) =>
  doctors.map(mapApiDoctorToDoctorVM);
