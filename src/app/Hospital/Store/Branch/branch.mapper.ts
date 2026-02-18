import { APIHospitalBranch, Branch, HospitalBranchVm } from "../../models/branch";

/** Map API model → Domain model */
export function mapApiBranchToBranch(api: APIHospitalBranch): Branch {
  return {
    oid: api.oid,
    code: api.code,
    name: api.name,
    address: api.address,
    city: api.city,
    state: api.state,
    postalCode: api.postalCode,
    country: api.country,
    isActive: api.isActive,
  };
}

/** Map API model → View model */
export function mapApiBranchToBranchVm(api: APIHospitalBranch): HospitalBranchVm {
  return {
    oid: api.oid,
    code: api.code,
    name: api.name,
    address: api.address,
    city: api.city,
    state: api.state,
    postalCode: api.postalCode,
    country: api.country,
    isActive: api.isActive,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

/** Map API array → Domain model array */
export const mapApiBranchesToBranches = (
  branches: APIHospitalBranch[]
): Branch[] => branches.map(mapApiBranchToBranch);

/** Map API array → View model array */
export const mapApiBranchesToBranchVms = (
  branches: APIHospitalBranch[]
): HospitalBranchVm[] => branches.map(mapApiBranchToBranchVm);
