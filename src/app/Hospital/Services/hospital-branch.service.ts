import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import ApiService from 'src/app/shared/services/api.service';
import { ApiResponse, ApiSearchResponse } from '../../common/Models/api-response';
import { RequestWrapper } from '../../common/Models/request';
import { APIHospitalBranch, Branch } from 'src/app/Hospital/models/branch';

@Injectable({
  providedIn: 'root'
})
export class HospitalBranchService {
  constructor(private apiService: ApiService) { }


  getBranches(): Observable<APIHospitalBranch[]> {
    return this.apiService.get<ApiResponse<APIHospitalBranch[]>>('HospitalBranch', { activeOnly: true }).pipe(
      map((response: ApiResponse<APIHospitalBranch[]>) => response.data))
  }

  createBranch(body: Branch): Observable<APIHospitalBranch> {
    return this.apiService
      .post<ApiResponse<APIHospitalBranch>>('HospitalBranch', body)
      .pipe(
        map((response: ApiResponse<APIHospitalBranch>) => response.data)
      );
  }

  getBranch(id: string): Observable<APIHospitalBranch> {
    return this.apiService
      .getSingle<ApiResponse<APIHospitalBranch>>('HospitalBranch', id)
      .pipe(
        map((response: ApiResponse<APIHospitalBranch>) => response.data)
      );
  }

  updateBranch(id: string, body: Branch): Observable<APIHospitalBranch> {
    return this.apiService
      .put<ApiResponse<APIHospitalBranch>>('HospitalBranch', id, body)
      .pipe(
        map((response: ApiResponse<APIHospitalBranch>) => response.data)
      );
  }

  deleteBranch(id: string): Observable<string> {
    return this.apiService
      .delete<ApiResponse<string>>('HospitalBranch', id)
      .pipe(
        map((response: ApiResponse<string>) => response.data)
      );
  }


  search(body: RequestWrapper): Observable<{ branches: APIHospitalBranch[]; total: number }> {
    return this.apiService
      .query<ApiSearchResponse<APIHospitalBranch>>('HospitalBranch/query', body)
      .pipe(
        map((response: ApiSearchResponse<APIHospitalBranch>) => {
          return {
            branches: response.data.data ?? [],
            total: response.data.totalPages ?? 0,
          };
        })
      );
  }
}
