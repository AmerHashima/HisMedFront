import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export default class ApiService {
   baseUrl:string = 'http://50.6.228.16:5000/api';

  constructor(private http: HttpClient) { }
  get<T>(url: string, params?: Record<string, any>): Observable<T> {
    const httpParams = new HttpParams({ fromObject: params || {} });
    return this.http.get<T>(`${this.baseUrl}/${url}`, { params: httpParams });
  }

  post<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${url}`, body, { headers });
  }

  // PUT request
  put<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${url}`, body, { headers });
  }

  // DELETE request
  delete<T>(url: string, params?: Record<string, any>): Observable<T> {
    const httpParams = new HttpParams({ fromObject: params || {} });
    return this.http.delete<T>(`${this.baseUrl}/${url}`, { params: httpParams });
  }


}
