import { ApiPatient } from '../models/api-patient';
import { Patient } from '../models/patient';

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
