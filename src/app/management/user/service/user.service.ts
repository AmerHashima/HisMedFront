import { Injectable } from '@angular/core';
import ApiService from "./../../../shared/services/api.service";
import { ApiResponse } from '../../../common/Models/api-response';
import { map, Observable } from 'rxjs';
import { User } from '../models/user';
import { ApiUser } from '../models/api-user';
import { RequestWrapper } from '../../../common/Models/request';
@Injectable({
  providedIn: 'root'
})
export default class UserService {
  private token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzZWY2ZTQ0MC0zNWVhLTQ3ZDgtOWNkNy03MWM1NDI3ZjY1NWMiLCJ1bmlxdWVfbmFtZSI6InN0cmluZyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJzdHJpbmciLCJyb2xlX2lkIjoiMCIsImp0aSI6ImJhODk1YzBjLWJlMmYtNGMwOC04MjU3LTM3M2U1OTMwMjRhZCIsImlhdCI6MTc2ODc2NDc3MywiZXhwIjoxNzY4NzY4MzczLCJpc3MiOiJodHRwczovL2FwaS55b3VyZG9tYWluLmNvbSIsImF1ZCI6Imh0dHBzOi8vYXBpLnlvdXJkb21haW4uY29tIn0.bgg95JDTfziyo9XwVTfMX68efv0grI8JOg3YfrNgeqg";
  constructor(private apiService: ApiService) { }


  getUsers(): Observable<ApiUser[]> {
    return this.apiService.get<ApiResponse<ApiUser[]>>('SystemUser', this.token).pipe(
      map((response: ApiResponse<ApiUser[]>) => {
        if (!response.success) {
          throw new Error(response.message || 'API failed to load users');
        }
        return response.data;
      })
    );
  }

  createUser(body: User): Observable<ApiUser> {
    return this.apiService
      .post<ApiResponse<ApiUser>>('SystemUser', body, this.token)
      .pipe(
        map((response: ApiResponse<ApiUser>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to create user';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  getUser(id: string): Observable<ApiUser> {
    return this.apiService
      .getSingle<ApiResponse<ApiUser>>('SystemUser', id, this.token)
      .pipe(
        map((response: ApiResponse<ApiUser>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to load user';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  updateUser(id: string, body: User): Observable<ApiUser> {
    return this.apiService
      .put<ApiResponse<ApiUser>>('SystemUser', id, body, this.token)
      .pipe(
        map((response: ApiResponse<ApiUser>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to update user';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  deleteUser(id: string): Observable<string> {
    return this.apiService
      .put<ApiResponse<string>>('SystemUser', id, this.token)
      .pipe(
        map((response: ApiResponse<string>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to delete user';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  search(body: RequestWrapper): Observable<ApiUser[]> {
    return this.apiService
      .query<ApiResponse<{ data: ApiUser[] }>>('SystemUser/query', body, this.token)
      .pipe(
        map((response: ApiResponse<{ data: ApiUser[] }>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to query';
            throw new Error(msg);
          }
          return response.data.data;
        })
      );
  }
}
