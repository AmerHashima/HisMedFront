import { BaseCrudState } from "src/app/common/Models/base-crud-state";

export interface Branch {
  oid?: string,
  code: string,
  name: string,
  address: string,
  city: string,
  state: string|null,
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
  state: string | null,
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



export type HospitalBranchState = BaseCrudState<HospitalBranchVm>;

