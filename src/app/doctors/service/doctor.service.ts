import { Injectable } from '@angular/core';
import { ApiDocor } from '../models/api-docor';
import { map, Observable } from 'rxjs';
import { ApiResponse, ApiSearchResponse } from 'src/app/common/Models/api-response';
import ApiService from 'src/app/shared/services/api.service';
import { Doctor } from '../models/doctor';
import { RequestWrapper } from 'src/app/common/Models/request';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

constructor(private apiService: ApiService) { }


  getDoctors(): Observable<ApiDocor[]> {
    return this.apiService.get<ApiResponse<ApiDocor[]>>('Doctor').pipe(
      map((response: ApiResponse<ApiDocor[]>) => response.data)
    );
  }

  createDoctor(body: Doctor): Observable<ApiDocor> {
    return this.apiService
      .post<ApiResponse<ApiDocor>>('Doctor', body)
      .pipe(
        map((response: ApiResponse<ApiDocor>) => response.data)
      );
  }


  getDoctor(id: string): Observable<ApiDocor> {
    return this.apiService
      .getSingle<ApiResponse<ApiDocor>>('Doctor', id)
      .pipe(
        map((response: ApiResponse<ApiDocor>) => response.data)
      );
  }

  updateDoctor(id: string, body: Doctor): Observable<ApiDocor> {
    return this.apiService
      .put<ApiResponse<ApiDocor>>('Doctor', id, body)
      .pipe(
        map((response: ApiResponse<ApiDocor>) => response.data)
      );
  }

  deleteDoctor(id: string): Observable<string> {
    return this.apiService
      .delete<ApiResponse<string>>('Doctor', id)
      .pipe(
        map((response: ApiResponse<string>) => response.data)
      );
  }

  search(body: RequestWrapper): Observable<{ doctors: ApiDocor[]; total: number }> {
    return this.apiService
      .query<ApiSearchResponse<ApiDocor>>('Doctor/query', body)
      .pipe(
        map((response: ApiSearchResponse<ApiDocor>) => {
          return {
            doctors: response.data.data ?? [],
            total: response.data.totalPages ?? 0,
          };
        })
      );
  }


}
