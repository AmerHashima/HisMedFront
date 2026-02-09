import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import ApiService from 'src/app/shared/services/api.service';
import { ApiResponse } from '../Models/api-response';
import { ApiLookup } from '../Models/lookup';

export const LOOKUP_CODES = {
  DEPARTMENT: 'DEPARTMENT',
  BLOOD_GROUP: 'BLOOD_GROUP',
  IDENTITY_TYPE: 'IDENTITY_TYPE',
  GENDER: 'GENDER',
  MARITAL_STATUS: 'MARITAL_STATUS',
  NATIONALITY: 'NATIONALITY',
  APPOINTMENT_STATUS: 'APPOINTMENT_STATUS',
  ENCOUNTER_TYPE: 'ENCOUNTER_TYPE',
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
        map((response: ApiResponse<ApiLookup>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to load user';
            throw new Error(msg);
          }
          return response.data;
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
  getENCOUNTER_TYPE(){
    return this.getLookUpByCode(LOOKUP_CODES.ENCOUNTER_TYPE);
  }

}
