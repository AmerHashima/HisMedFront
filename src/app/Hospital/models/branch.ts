import { BaseCrudState } from "src/app/common/Models/base-crud-state";

export interface Branch {
  oid?: string,
  code: string,
  name: string,
  address: string,
  city: string,
  state: string,
  postalCode: string,
  country: string,
  isActive: boolean
}

export interface APIHospitalBranch {
  oid: string,
  code: string,
  name: string,
  address: string,
  city: string,
  state: string,
  postalCode: string,
  country: string,
  isActive: boolean,
  createdAt: string,
  updatedAt: string

}


export interface HospitalBranchVm extends Branch {
  oid:string,
  createdAt: string;
  updatedAt: string;
}


// export interface HospitalBranchState {
//   branches: HospitalBranchVm[];
//   selectedBranch: HospitalBranchVm | null;
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
export type HospitalBranchState = BaseCrudState<HospitalBranchVm>;

