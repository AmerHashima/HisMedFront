// src\app\patients\service\patient.service.ts
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import ApiService from 'src/app/shared/services/api.service';
import { ApiPatient } from '../models/api-patient';
import { ApiResponse, ApiSearchResponse } from 'src/app/common/Models/api-response';
import { Patient } from '../models/patient';
import { RequestWrapper } from 'src/app/common/Models/request';

type PatientLookupType = 'id' | 'mrn';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private apiService: ApiService) { }


  getPatients(): Observable<ApiPatient[]> {
    return this.apiService.get<ApiResponse<ApiPatient[]>>('Patient').pipe(
      map((response: ApiResponse<ApiPatient[]>) => response.data)
    );
  }

  createPatient(body: Patient): Observable<ApiPatient> {
    return this.apiService
      .post<ApiResponse<ApiPatient>>('https://localhost:7294/api/Patient/full', body)
      .pipe(
        map((response: ApiResponse<ApiPatient>) => response.data)
      );
  }



  getPatient(value: string, type: PatientLookupType = 'id'): Observable<ApiPatient> {
    const endpoint =
      type === 'mrn'
        ? 'Patient/by-mrn'
        : 'Patient';

    return this.apiService
      .getSingle<ApiResponse<ApiPatient>>(endpoint, value)
      .pipe(
        map((response: ApiResponse<ApiPatient>) => response.data)
      )
    // .pipe(map(this.mapApiResponse));
  }
  updatePatient(id: string, body: Patient): Observable<ApiPatient> {
    return this.apiService
      .put<ApiResponse<ApiPatient>>('Patient', id, body)
      .pipe(
        map((response: ApiResponse<ApiPatient>) => response.data)
      );
  }

  deletePatient(id: string): Observable<string> {
    return this.apiService
      .delete<ApiResponse<string>>('Patient', id)
      .pipe(
        map((response: ApiResponse<string>) => response.data)
      );
  }

  search(body: RequestWrapper): Observable<{ patients: ApiPatient[]; total: number }> {
    return this.apiService
      .query<ApiSearchResponse<ApiPatient>>('Patient/query', body)
      .pipe(
        map((response: ApiSearchResponse<ApiPatient>) => {
          return {
            patients: response.data.data ?? [],
            total: response.data.totalPages ?? 0,
          };
        })
      );
  }

  //  private mapApiResponse<T>(response: ApiResponse<T>): T {
  //   if (!response.success) {
  //     const msg =
  //       response.errors?.join(', ')
  //       || response.message
  //       || 'API request failed';

  //     throw new Error(msg);
  //   }

  //   return response.data;
  // }
}
