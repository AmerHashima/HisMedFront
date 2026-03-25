// src\app\doctors\service\doctor.service.ts
import { Injectable } from '@angular/core';
import { ApiDocor } from '../models/api-docor';
import { map, Observable } from 'rxjs';
import { ApiResponse, ApiSearchResponse } from 'src/app/common/Models/api-response';
import ApiService from 'src/app/shared/services/api.service';
import { Doctor } from '../models/doctor';
import {  RequestWrapper } from 'src/app/common/Models/request';
import { APIDoctorSchedule, APIDoctorScheduleBulk, ApiDoctorScheduleDetail, DoctorSchedule, DoctorScheduleBulk, DoctorScheduleDetail, editMasterDoctorSchedule } from '../models/doctor-schedule';
import { APIDoctorScheduleException, DoctorScheduleException } from '../models/doctor-schedule-expection';

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

  // doctor schedule master
  // createDoctorSchedule(body: DoctorSchedule): Observable<APIDoctorSchedule> {
  createMasterDoctorSchedule(body: DoctorSchedule): Observable<APIDoctorScheduleBulk> {
    return this.apiService
      .post<ApiResponse<APIDoctorScheduleBulk>>('DoctorSchedule', body)
      .pipe(
        map((response: ApiResponse<APIDoctorScheduleBulk>) => response.data)
      );
  }

  // updateDoctorSchedule(id: string, body: DoctorSchedule): Observable<APIDoctorSchedule> {
  //   return this.apiService
  //     .put<ApiResponse<APIDoctorSchedule>>('DoctorSchedule', id, body)
  //     .pipe(
  //       map((response: ApiResponse<APIDoctorSchedule>) => response.data)
  //     );
  // }

  updateMasterDoctorSchedule(id: string, body: editMasterDoctorSchedule): Observable<APIDoctorScheduleBulk> {
    return this.apiService
      .put<ApiResponse<APIDoctorScheduleBulk>>('DoctorSchedule', id, body)
      .pipe(
        map((response: ApiResponse<APIDoctorScheduleBulk>) => response.data)
      );
  }



  deleteMasterDoctoSchedule(id: string): Observable<string> {
    return this.apiService
      .delete<ApiResponse<string>>('DoctorSchedule', id)
      .pipe(
        map((response: ApiResponse<string>) => response.data)
      );
  }


  // getDoctorSchedule(id: string): Observable<APIDoctorSchedule> {
  getMasterDoctorSchedule(id: string): Observable<APIDoctorScheduleBulk> {

    return this.apiService
      .getSingle<ApiResponse<APIDoctorScheduleBulk>>('DoctorSchedule', id)
      .pipe(
        map((response: ApiResponse<APIDoctorScheduleBulk>) => response.data)
      );
  }

  // getDoctorSchedules(filters: Filter[]): Observable<APIDoctorSchedule[]> {
  //   console.log('in get doctor schedile');
  //   const params: Record<string, string> = {};

  //   if (filters?.length) {
  //     console.log('in filters')
  //     filters.forEach((f, i) => {
  //       params[`Request.Filters`] = JSON.stringify(f);
  //     });
  //   }
  //   return this.apiService.get<ApiResponse<APIDoctorSchedule[]>>('DoctorSchedule',params).pipe(
  //     map((response: ApiResponse<APIDoctorSchedule[]>) => response.data)
  //   );
  // }

  queryMasterDoctorSchedules(body: RequestWrapper): Observable<{ doctorSchedules: APIDoctorSchedule[]; total: number }> {
    return this.apiService
      .query<ApiSearchResponse<APIDoctorSchedule>>('DoctorSchedule/query', body)
      .pipe(
        map((response: ApiSearchResponse<APIDoctorSchedule>) => {
          return {
            doctorSchedules: response.data.data ?? [],
            total: response.data.totalPages ?? 0,
          };
        })
      );
  }


  getMasterDoctorSchedules(): Observable<APIDoctorSchedule[]> {
    return this.apiService.get<ApiResponse<APIDoctorSchedule[]>>('DoctorSchedule').pipe(
      map((response: ApiResponse<APIDoctorSchedule[]>) => response.data)
    );
  }


  createBulkDoctorSchedule(body: DoctorScheduleBulk): Observable<APIDoctorScheduleBulk> {
    return this.apiService
      .post<ApiResponse<APIDoctorScheduleBulk>>('DoctorSchedule/AddDoctorScheduleBulk', body)
      .pipe(
        map((response: ApiResponse<APIDoctorScheduleBulk>) => response.data)
      );
  }

  //detail

  creatDetailDoctorSchedule(body: DoctorScheduleDetail): Observable<ApiDoctorScheduleDetail> {
    return this.apiService
      .post<ApiResponse<ApiDoctorScheduleDetail>>('DoctorSchedule/detail', body)
      .pipe(
        map((response: ApiResponse<ApiDoctorScheduleDetail>) => response.data)
      );
  }

  updateDetailDoctorSchedule(id: string, body: DoctorScheduleDetail): Observable<ApiDoctorScheduleDetail> {
    return this.apiService
      .put<ApiResponse<ApiDoctorScheduleDetail>>('DoctorSchedule/detail', id, body)
      .pipe(
        map((response: ApiResponse<ApiDoctorScheduleDetail>) => response.data)
      );
  }

  deleteDetailDoctoSchedule(id: string): Observable<string> {
    return this.apiService
      .delete<ApiResponse<string>>('DoctorSchedule/Detail', id)
      .pipe(
        map((response: ApiResponse<string>) => response.data)
      );
  }
  //doctor exception


  createDoctorException(body: DoctorScheduleException): Observable<APIDoctorScheduleException> {
    return this.apiService
      .post<ApiResponse<APIDoctorScheduleException>>('DoctorScheduleException', body)
      .pipe(
        map((response: ApiResponse<APIDoctorScheduleException>) => response.data)
      );
  }

  updateDoctorScheduleException(id: string, body: DoctorScheduleException): Observable<APIDoctorScheduleException> {
    return this.apiService
      .put<ApiResponse<APIDoctorScheduleException>>('DoctorScheduleException', id, body)
      .pipe(
        map((response: ApiResponse<APIDoctorScheduleException>) => response.data)
      );
  }


  deleteDoctoScheduleException(id: string): Observable<string> {
    return this.apiService
      .delete<ApiResponse<string>>('DoctorScheduleException', id)
      .pipe(
        map((response: ApiResponse<string>) => response.data)
      );
  }


  getDoctorScheduleException(id: string): Observable<APIDoctorScheduleException> {
    return this.apiService
      .getSingle<ApiResponse<APIDoctorScheduleException>>('DoctorScheduleException', id)
      .pipe(
        map((response: ApiResponse<APIDoctorScheduleException>) => response.data)
      );
  }

  getDoctorExceptions(body: RequestWrapper): Observable<{ doctorsExceptions: APIDoctorScheduleException[]; total: number }> {
    return this.apiService
      .query<ApiSearchResponse<APIDoctorScheduleException>>('DoctorScheduleException', body)
      .pipe(
        map((response: ApiSearchResponse<APIDoctorScheduleException>) => {
          return {
            doctorsExceptions: response.data.data ?? [],
            total: response.data.totalPages ?? 0,
          };
        })
      );
  }
}
