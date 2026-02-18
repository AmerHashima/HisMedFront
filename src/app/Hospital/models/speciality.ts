
export interface Speciality {
  oid?: string,
  code: string,
  nameAr: string,
  nameEn: string,
  defaultVisitDuration: number,
  defaultPrice:number,
  isActive: boolean
}

export interface APISpeciality {
  oid: string,
  code: string,
  nameAr: string,
  nameEn: string,

  defaultVisitDuration: number,
  defaultPrice: number,

  isActive: boolean,
  createdAt: string,
  updatedAt: string

}


export interface SpecialityVm extends Speciality {
  createdAt: string;
  updatedAt: string;
}


export interface SpecialityState {
  specialities: SpecialityVm[];
  selectedSpeciality: SpecialityVm | null;
  success: boolean
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  total: number;
  search: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc' | '';
}
