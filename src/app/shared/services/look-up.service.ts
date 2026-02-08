import { Injectable } from '@angular/core';
import ApiService from './api.service';
import { ApiLookup, ApiLookupResponse, Lookup } from 'src/app/common/Models/lookup';
import { map, Observable } from 'rxjs';
import { ApiResponse } from 'src/app/common/Models/api-response';

@Injectable({
  providedIn: 'root'
})
export class LookUpService {

   constructor(private apiService: ApiService) { }

  createLookUpMaster(body: Lookup): Observable<ApiLookup> {
       return this.apiService
         .post<ApiLookupResponse>('AppLookup/masters', body)
         .pipe(
           map((response: ApiLookupResponse) => {
             if (!response.success) {
               const msg = response.errors?.join(', ') || response.message || 'API failed to create LOOKUP';
               throw new Error(msg);
             }
             return response.data;
           })
         );
     }

  // createLookUpDetails(body: Lookup): Observable<ApiLookup> {
  //   return this.apiService
  //     .post<ApiLookupResponse>('AppLookup/details', body)
  //     .pipe(
  //       map((response: ApiLookupResponse) => {
  //         if (!response.success) {
  //           const msg = response.errors?.join(', ') || response.message || 'API failed to create LOOKUP';
  //           throw new Error(msg);
  //         }
  //         return response.data;
  //       })
  //     );
  // }

}
