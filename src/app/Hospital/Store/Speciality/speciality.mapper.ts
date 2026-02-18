import { APISpeciality, Speciality, SpecialityVM } from "../../models/speciality";


/** Map API model → Domain model */
export function mapApiSpecialityToSpeciality(api: APISpeciality): Speciality {
  return {
    oid: api.oid,
    code:api.code,
    nameEn: api.nameEn,
    nameAr: api.nameAr,
    defaultPrice:api.defaultPrice,
    defaultVisitDuration:api.defaultVisitDuration,
    isActive: api.isActive,
  };
}

/** Map API model → View model */
export function mapApiSpecialityToSpecialityVM(api: APISpeciality): SpecialityVM {
  return {
    oid: api.oid,
    code: api.code,
    nameEn: api.nameEn,
    nameAr: api.nameAr,
    defaultVisitDuration: api.defaultVisitDuration,
    defaultPrice: api.defaultPrice,
    isActive: api.isActive,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

/** Map API array → Domain model array */
export const mapApiSpecialitiesToSpecialities = (specialities: APISpeciality[]): Speciality[] =>
  specialities.map(mapApiSpecialityToSpeciality);

/** Map API array → View model array */
export const mapApiSpecialitiesToSpecialityVMs = (specialities: APISpeciality[]): SpecialityVM[] =>
  specialities.map(mapApiSpecialityToSpecialityVM);
