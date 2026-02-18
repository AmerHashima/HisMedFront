import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import ApiService from 'src/app/shared/services/api.service';
import { ApiResponse, ApiSearchResponse } from '../../common/Models/api-response';
import { RequestWrapper } from '../../common/Models/request';
import { APISpeciality, Speciality } from 'src/app/Hospital/models/speciality';

@Injectable({
  providedIn: 'root'
})
export class SpecialityService {
  constructor(private apiService: ApiService) { }
  getSpecialities(): Observable<APISpeciality[]> {
    return this.apiService.get<ApiResponse<APISpeciality[]>>('Specialty', { activeOnly: true }).pipe(
      map((response: ApiResponse<APISpeciality[]>) => {
        if (!response.success) {
          throw new Error(response.message || 'API failed to load specialities');
        }
        return response.data;
      })
    );
  }

  createSpeciality(body: Speciality): Observable<APISpeciality> {
    return this.apiService
      .post<ApiResponse<APISpeciality>>('Specialty', body)
      .pipe(
        map((response: ApiResponse<APISpeciality>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to create Specialty';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  getSpecialty(id: string): Observable<APISpeciality> {
    return this.apiService
      .getSingle<ApiResponse<APISpeciality>>('Specialty', id)
      .pipe(
        map((response: ApiResponse<APISpeciality>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to load Specialty';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  updateSpecialty(id: string, body: Speciality): Observable<APISpeciality> {
    return this.apiService
      .put<ApiResponse<APISpeciality>>('Specialty', id, body)
      .pipe(
        map((response: ApiResponse<APISpeciality>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to update specialty';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  deleteSpecialty(id: string): Observable<string> {
    return this.apiService
      .delete<ApiResponse<string>>('Specialty', id)
      .pipe(
        map((response: ApiResponse<string>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to delete specialty';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }


  search(body: RequestWrapper): Observable<{ specialities: APISpeciality[]; total: number }> {
    return this.apiService
      .query<ApiSearchResponse<APISpeciality>>('Specialty/query', body)
      .pipe(
        map((response: ApiSearchResponse<APISpeciality>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to query';
            throw new Error(msg);
          }
          return {
            specialities: response.data.data ?? [],
            total: response.data.totalPages ?? 0,
          };
        })
      );
  }
}
