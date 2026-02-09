import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import ApiService from 'src/app/shared/services/api.service';
import { ApiResponse, ApiSearchResponse } from '../Models/api-response';
import { APIRole, Role } from '../Models/role';
import { RequestWrapper } from '../Models/request';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

 constructor(private apiService: ApiService) { }
  getRoles(): Observable<APIRole[]> {
    return this.apiService.get<ApiResponse<APIRole[]>>('Role').pipe(
      map((response: ApiResponse<APIRole[]>) => {
        if (!response.success) {
          throw new Error(response.message || 'API failed to load roles');
        }
        return response.data;
      })
    );
  }

  createRole(body: Role): Observable<APIRole> {
    return this.apiService
      .post<ApiResponse<APIRole>>('Role', body)
      .pipe(
        map((response: ApiResponse<APIRole>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to create role';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  getRole(id: string): Observable<APIRole> {
    return this.apiService
      .getSingle<ApiResponse<APIRole>>('Role', id)
      .pipe(
        map((response: ApiResponse<APIRole>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to load role';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  updateRole(id: string, body: Role): Observable<APIRole> {
    return this.apiService
      .put<ApiResponse<APIRole>>('Role', id, body)
      .pipe(
        map((response: ApiResponse<APIRole>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to update role';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  deleteRole(id: string): Observable<string> {
    return this.apiService
      .delete<ApiResponse<string>>('Role', id)
      .pipe(
        map((response: ApiResponse<string>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to delete role';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }


  search(body: RequestWrapper): Observable<{ roles: APIRole[]; total: number }> {
    return this.apiService
      .query<ApiSearchResponse<APIRole>>('Role/query', body)
      .pipe(
        map((response: ApiSearchResponse<APIRole>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to role';
            throw new Error(msg);
          }
          return {
            roles: response.data.data ?? [],
            total: response.data.totalPages ?? 0,
          };
        })
      );
  }
}
