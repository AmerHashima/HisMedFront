export interface Speciality {
  code: string,
  nameAr: string,
  nameEn: string,
  defaultVisitDuration: number,
  defaultPrice: number,
  isActive: boolean
}

export interface APISpeciality {
  oid: string
  code: string,
  nameAr: string,
  nameEn: string,
  defaultVisitDuration: number,
  defaultPrice: number,
  isActive: boolean,
  createdAt: string,
  updatedAt: string
}



