import { ApiPatient } from '../models/api-patient';
import { Patient } from '../models/patient';
import { PatientVM } from '../models/patient-vm';

export function mapApiPatientToPatient(api: ApiPatient): Patient {
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
  };
}

export const mapApiPatientsToPatients = (patients: ApiPatient[]): Patient[] =>
  patients.map(mapApiPatientToPatient);

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


export const mapApiPatientsToPatientVMs = (patients: ApiPatient[]) =>
  patients.map(mapApiPatientToPatientVM);
