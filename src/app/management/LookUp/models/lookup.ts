import { BaseCrudState } from 'src/app/common/Models/base-crud-state';

export interface LookUPMaster {
  oid?: string,
  lookupCode: string,
  lookupNameAr: string,
  lookupNameEn: string,
  description: string,
  isSystem: boolean
}



export interface APILookUPMaster {
  oid: string,
  lookupCode: string,
  lookupNameAr: string,
  lookupNameEn: string,
  description: string,
  isSystem: boolean,
  createdAt: string,
  updatedAt: string | null,
  lookupDetails: APILookupDetail[]
}

export interface LookupDetail {
  oid?:string,
  lookupMasterID: string,
  valueCode: string,
  valueNameAr: string,
  valueNameEn: string,
  sortOrder: number,
  isDefault: boolean
}

export interface APILookupDetail {
  oid: string,
  lookupMasterID: string,
  valueCode: string,
  valueNameAr: string,
  valueNameEn: string,
  sortOrder: number,
  isDefault: boolean,
  createdAt: string
  updatedAt: string | null,
  masterLookupCode: string
}

export interface LookUPDetailVM extends LookupDetail {
  oid: string,
  createdAt: string;
  updatedAt: string;
  masterLookupCode: string
}

export interface LookUPMasterVM extends LookUPMaster {
  oid:string,
  createdAt: string;
  updatedAt: string;
  lookupDetails: APILookupDetail[]
}



// export type LookupMasterhState = BaseCrudState<LookUPMasterVM>;

export type LookupMasterState = BaseCrudState<LookUPMasterVM> & {
  details: LookUPDetailVM[];
  selectedDetail: LookUPDetailVM | null
};
