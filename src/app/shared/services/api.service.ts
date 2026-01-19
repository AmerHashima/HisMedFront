import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export default class ApiService {
  baseUrl: string = 'http://50.6.228.16:5000/api';

  constructor(private http: HttpClient) { }

  // Helper to create headers with optional token
  private createHeaders(token?: string): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `bearer ${token}`);
    }    return headers;
  }

  // get<T>(url: string, params?: Record<string, any>, token?: string): Observable<T> {
    // const httpParams = new HttpParams({ fromObject: params || {} });
  get<T>(url: string, token?: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${url}`, {
      headers: this.createHeaders(token),
    });
  }

  getSingle<T>(url: string, id: string,token?: string ): Observable<T> {
    const fullUrl =`${this.baseUrl}/${url}/${id}`;
    return this.http.get<T>(fullUrl, { headers: this.createHeaders(token) });
  }

  post<T>(url: string, body: any, token?: string): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${url}`, body, {
      headers: this.createHeaders(token),
    });
  }


  put<T>(url: string, id:string, body: any, token?: string,): Observable<T> {
    const fullUrl = `${this.baseUrl}/${url}/${id}` ;
    return this.http.put<T>(fullUrl, body, { headers: this.createHeaders(token) });
  }

  // delete<T>(url: string, params?: Record<string, any>, token?: string): Observable<T> {
  delete<T>(url: string, id: string ,token?: string): Observable<T> {
    // const httpParams = new HttpParams({ fromObject: params || {} });
    const fullUrl =`${this.baseUrl}/${url}/${id}`;
    return this.http.delete<T>(fullUrl, {
      // params: httpParams,
      headers: this.createHeaders(token),
    });
  }

  query<T>(url: string, body: any, token?: string): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${url}`, body, {
      headers: this.createHeaders(token),
    });
  }

}
