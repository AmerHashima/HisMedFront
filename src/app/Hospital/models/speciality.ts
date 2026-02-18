import { BaseCrudState } from "src/app/common/Models/base-crud-state";

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


export interface SpecialityVM extends Speciality {
  oid: string;
  createdAt: string;
  updatedAt: string;
}


// export interface SpecialityState {
//   specialities: SpecialityVM[];
//   selectedSpeciality: SpecialityVM | null;
//   success: boolean
//   loading: boolean;
//   error: string | null;
//   page: number;
//   pageSize: number;
//   total: number;
//   search: string;
//   sortBy: string;
//   sortDirection: 'asc' | 'desc' | '';
// }
export type SpecialityState = BaseCrudState<SpecialityVM>;
