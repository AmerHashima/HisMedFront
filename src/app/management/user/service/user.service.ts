// src\app\management\user\service\user.service.ts
import { Injectable } from '@angular/core';
import ApiService from "./../../../shared/services/api.service";
import { ApiResponse, ApiSearchResponse } from '../../../common/Models/api-response';
import { map, Observable, tap } from 'rxjs';
import { User } from '../models/user';
import { ApiUser } from '../models/api-user';
import { RequestWrapper } from '../../../common/Models/request';
@Injectable({
  providedIn: 'root'
})
export default class UserService {

   constructor(private apiService: ApiService) { }


  getUsers(): Observable<ApiUser[]> {
    return this.apiService.get<ApiResponse<ApiUser[]>>('SystemUser').pipe(
      map((response: ApiResponse<ApiUser[]>) => response.data)

    );
  }

  createUser(body: User): Observable<ApiUser> {
    return this.apiService
      .post<ApiResponse<ApiUser>>('SystemUser', body)
      .pipe(
        map((response: ApiResponse<ApiUser>) => response.data)
      );
  }

  getUser(id: string): Observable<ApiUser> {
    return this.apiService
      .getSingle<ApiResponse<ApiUser>>('SystemUser', id)
      .pipe(
        map((response: ApiResponse<ApiUser>) => response.data)
      );
  }

  updateUser(id: string, body: User): Observable<ApiUser> {
    return this.apiService
      .put<ApiResponse<ApiUser>>('SystemUser', id, body)
      .pipe(
        map((response: ApiResponse<ApiUser>) => response.data)

      );
  }

  deleteUser(id: string): Observable<string> {
    return this.apiService
      .delete<ApiResponse<string>>('SystemUser', id)
      .pipe(
        map((response: ApiResponse<string>) => response.data)
      );
  }

  // search(body: RequestWrapper): Observable<ApiUser[]> {
  //   return this.apiService
  //     .query<ApiResponse<{ data: ApiUser[] }>>('SystemUser/query', body, this.token)
  //     .pipe(
  //       map((response: ApiResponse<{ data: ApiUser[] }>) => {
  //         if (!response.success) {
  //           const msg = response.errors?.join(', ') || response.message || 'API failed to query';
  //           throw new Error(msg);
  //         }
  //         return response.data.data;
  //       })
  //     );
  // }
  search(body: RequestWrapper): Observable<{ users: ApiUser[]; total: number }> {
    return this.apiService
      .query<ApiSearchResponse<ApiUser>>('SystemUser/query', body)
      .pipe(
        map((response: ApiSearchResponse<ApiUser>) => {
          return {
            users: response.data.data ?? [],
            total: response.data.totalPages ?? 0,
          };
        })
      );
  }
}
