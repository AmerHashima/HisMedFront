
import {
  APILookupDetail, APILookUPMaster,
  LookUPMaster,
  LookupDetail,
  LookUPMasterVM,
  LookUPDetailVM } from '../models/lookup';

/* ============================================================
   🔹 LOOKUP DETAIL MAPPERS
============================================================ */

/** API → Domain */
export function mapApiLookupDetailToLookupDetail(
  api: APILookupDetail
): LookupDetail {
  return {
    oid: api.oid,
    lookupMasterID: api.lookupMasterID,
    valueCode: api.valueCode,
    valueNameAr: api.valueNameAr,
    valueNameEn: api.valueNameEn,
    sortOrder: api.sortOrder,
    isDefault: api.isDefault,
  };
}

/** API → ViewModel */
export function mapApiLookupDetailToLookupDetailVm(
  api: APILookupDetail
): LookUPDetailVM {
  return {
    oid: api.oid,
    lookupMasterID: api.lookupMasterID,
    valueCode: api.valueCode,
    valueNameAr: api.valueNameAr,
    valueNameEn: api.valueNameEn,
    sortOrder: api.sortOrder,
    isDefault: api.isDefault,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt ?? '',
    masterLookupCode: api.masterLookupCode,
  };
}

/** API Array → Domain Array */
export const mapApiLookupDetailsToLookupDetails = (
  details: APILookupDetail[]
): LookupDetail[] =>
  details?.map(mapApiLookupDetailToLookupDetail) ?? [];

/** API Array → VM Array */
export const mapApiLookupDetailsToLookupDetailVms = (
  details: APILookupDetail[]
): LookUPDetailVM[] =>
  details?.map(mapApiLookupDetailToLookupDetailVm) ?? [];


/* ============================================================
   🔹 LOOKUP MASTER MAPPERS
============================================================ */

/** API → Domain */
export function mapApiLookupMasterToLookupMaster(
  api: APILookUPMaster
): LookUPMaster {
  return {
    oid: api.oid,
    lookupCode: api.lookupCode,
    lookupNameAr: api.lookupNameAr,
    lookupNameEn: api.lookupNameEn,
    description: api.description,
    isSystem: api.isSystem,
  };
}

/** API → ViewModel */
export function mapApiLookupMasterToLookupMasterVm(
  api: APILookUPMaster
): LookUPMasterVM {
  return {
    oid: api.oid,
    lookupCode: api.lookupCode,
    lookupNameAr: api.lookupNameAr,
    lookupNameEn: api.lookupNameEn,
    description: api.description,
    isSystem: api.isSystem,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt ?? '',
    lookupDetails: api.lookupDetails ?? [],
  };
}

/** API Array → Domain Array */
export const mapApiLookupMastersToLookupMasters = (
  masters: APILookUPMaster[]
): LookUPMaster[] =>
  masters?.map(mapApiLookupMasterToLookupMaster) ?? [];

/** API Array → VM Array */
export const mapApiLookupMastersToLookupMasterVms = (
  masters: APILookUPMaster[]
): LookUPMasterVM[] =>
  masters?.map(mapApiLookupMasterToLookupMasterVm) ?? [];
