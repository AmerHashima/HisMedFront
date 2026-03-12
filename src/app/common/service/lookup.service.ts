// src\app\common\service\lookup.service.ts
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import ApiService from 'src/app/shared/services/api.service';
import { ApiResponse, ApiSearchResponse } from '../Models/api-response';
import { ApiLookup } from '../Models/lookup';
import { APILookupDetail, APILookUPMaster, LookupDetail, LookUPMaster } from 'src/app/management/LookUp/models/lookup';
import { RequestWrapper } from '../Models/request';

export const LOOKUP_CODES = {
  DEPARTMENT: 'DEPARTMENT',
  BLOOD_GROUP: 'BLOOD_GROUP',
  IDENTITY_TYPE: 'IDENTITY_TYPE',
  GENDER: 'GENDER',
  MARITAL_STATUS: 'MARITAL_STATUS',
  NATIONALITY: 'NATIONALITY',
  APPOINTMENT_STATUS: 'APPOINTMENT_STATUS',
  ENCOUNTER_TYPE: 'ENCOUNTER_TYPE',
  COUNTRY_TYPE:'COUNTRY',
  CITY_TYPE:'CITY',
  STATE_TYPE:'STATE',
  APPOINTMENT_TYPE:'APPOINTMENT_TYPES',
  APPOINTMENT_REASON:'APPOINTMENT_REASON',
  WEEK_DAYS:'Days',
  Day_Hours:"WORKING_HOURS",
    SLOT_DURATION: "SLOT_DURATION",
  ACTIVE_STATUS:"ACTIVE_STATUS"

} as const;

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  constructor(private apiService: ApiService) { }

  getLookUpByCode(code: string): Observable<ApiLookup> {
    return this.apiService
      .getSingle<ApiResponse<ApiLookup>>('AppLookup', code, { includeDetails: true }
      )
      .pipe(
        map((response: ApiResponse<ApiLookup>) => response.data)
      );
  }

  getDetailsByLookupMasterId(masterId: string): Observable<APILookupDetail[]> {
    const url = `AppLookup/${masterId}/details`
    return this.apiService
      .get<ApiResponse<APILookupDetail[]>>(url)
      .pipe(
        map((response: ApiResponse<APILookupDetail[]>) => response.data)
      );
  }

  getLookUpByMasterId(code: string): Observable<ApiLookup> {
    return this.apiService
      .getSingle<ApiResponse<ApiLookup>>('AppLookup', code, { includeDetails: true }
      )
      .pipe(
        map((response: ApiResponse<ApiLookup>) => response.data)
      );
  }

  createLookupMater(body: LookUPMaster): Observable<APILookUPMaster> {
    return this.apiService
      .post<ApiResponse<APILookUPMaster>>('AppLookup/masters', body)
      .pipe(
        map((response: ApiResponse<APILookUPMaster>) => response.data)
      );
  }
  createLookupDetail(body: LookupDetail): Observable<APILookupDetail> {
    return this.apiService
      .post<ApiResponse<APILookupDetail>>('AppLookup/details', body)
      .pipe(
        map((response: ApiResponse<APILookupDetail>) => response.data)
      );
  }

  search(body: RequestWrapper): Observable<{ lookups: APILookUPMaster[]; total: number }> {
    return this.apiService
      .query<ApiSearchResponse<APILookUPMaster>>('AppLookup/query', body)
      .pipe(
        map((response: ApiSearchResponse<APILookUPMaster>) => {
          return {
            lookups: response.data.data ?? [],
            total: response.data.totalPages ?? 0,
          };
        })
      );
  }
  getDepartment() {
    return this.getLookUpByCode(LOOKUP_CODES.DEPARTMENT);
  }
  getBloodGroup() {
    return this.getLookUpByCode(LOOKUP_CODES.BLOOD_GROUP);
  }
  getIdentityType() {
    return this.getLookUpByCode(LOOKUP_CODES.IDENTITY_TYPE);
  }
  getGender() {
    return this.getLookUpByCode(LOOKUP_CODES.GENDER);
  }
  getMaritalStatus() {
    return this.getLookUpByCode(LOOKUP_CODES.MARITAL_STATUS);
  }
  getNationality() {
    return this.getLookUpByCode(LOOKUP_CODES.NATIONALITY);
  }
  getAppointmentStatus() {
    return this.getLookUpByCode(LOOKUP_CODES.APPOINTMENT_STATUS);
  }
  getENCOUNTER_TYPE() {
    return this.getLookUpByCode(LOOKUP_CODES.ENCOUNTER_TYPE);
  }
  getCountries() {
    return this.getLookUpByCode(LOOKUP_CODES.COUNTRY_TYPE);
  }
  getCities() {
    return this.getLookUpByCode(LOOKUP_CODES.CITY_TYPE);
  }
  getStates() {
    return this.getLookUpByCode(LOOKUP_CODES.STATE_TYPE);
  }
  getAppointmentTypes() {
    return this.getLookUpByCode(LOOKUP_CODES.APPOINTMENT_TYPE);
  }
  getAppointmentReasons() {
    return this.getLookUpByCode(LOOKUP_CODES.APPOINTMENT_REASON);
  }
  getDays() {
    return this.getLookUpByCode(LOOKUP_CODES.WEEK_DAYS);
  }
  getDayHours() {
    return this.getLookUpByCode(LOOKUP_CODES.Day_Hours);
  }
  getSlotDuration() {
    return this.getLookUpByCode(LOOKUP_CODES.SLOT_DURATION);
  }
  getActiveStatus() {
    return this.getLookUpByCode(LOOKUP_CODES.ACTIVE_STATUS);
  }
}

