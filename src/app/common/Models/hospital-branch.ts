export interface HospitalBranch {
  oid?:string,
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
  updatedAt: string,
}
