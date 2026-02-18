import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse, ApiSearchResponse } from 'src/app/common/Models/api-response';
import ApiService from 'src/app/shared/services/api.service';
import { RequestWrapper } from 'src/app/common/Models/request';
import { APIAppointment, Appointment } from '../models/appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private apiService: ApiService) { }

  getAppointments(): Observable<APIAppointment[]> {
    return this.apiService.get<ApiResponse<APIAppointment[]>>('Appointment').pipe(
      map((response: ApiResponse<APIAppointment[]>) => {
        if (!response.success) {
          throw new Error(response.message || 'API failed to load appointments');
        }
        return response.data;
      })
    );
  }

  createAppointment(body: Appointment): Observable<APIAppointment> {
    return this.apiService
      .post<ApiResponse<APIAppointment>>('Appointment', body)
      .pipe(
        map((response: ApiResponse<APIAppointment>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to create appointment';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  getAppointment(id: string): Observable<APIAppointment> {
    return this.apiService
      .getSingle<ApiResponse<APIAppointment>>('Appointment', id)
      .pipe(
        map((response: ApiResponse<APIAppointment>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to load appointment';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  updateAppointment(id: string, body: Appointment): Observable<APIAppointment> {
    return this.apiService
      .put<ApiResponse<APIAppointment>>('Appointment', id, body)
      .pipe(
        map((response: ApiResponse<APIAppointment>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to update appointment';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  cancalAppointment(){
    
  }


  // search(body: RequestWrapper): Observable<{ appointments: APIAppointment[]; total: number }> {
  //   return this.apiService
  //     .query<ApiSearchResponse<APIAppointment>>('Appointment/query', body)
  //     .pipe(
  //       map((response: ApiSearchResponse<APIAppointment>) => {
  //         if (!response.success) {
  //           const msg = response.errors?.join(', ') || response.message || 'API failed to query appointments';
  //           throw new Error(msg);
  //         }
  //         return {
  //           appointments: response.data.data ?? [],
  //           total: response.data.totalPages ?? 0,
  //         };
  //       })
  //     );
  // }
}
