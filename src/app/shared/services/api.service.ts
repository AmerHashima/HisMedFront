// src\app\shared\services\api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export default class ApiService {
  private readonly baseUrl: string = environment.baseUrl;
  // private token='';
  constructor(private http: HttpClient,private authService:AuthService) {

   }

  // Helper to create headers with optional token
  private createHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this.authService.getToken();
    if (token) {
      headers = headers.set('Authorization', `bearer ${token}`);
    } return headers;
  }

  // setToken(token:string){
  //   this.token=token;
  // }

  // get<T>(url: string, params?: Record<string, any>, token?: string): Observable<T> {
  // const httpParams = new HttpParams({ fromObject: params || {} });
  get<T>(url: string, params?: Record<string, any>): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${url}`, {
      headers: this.createHeaders(),
      params
    });
  }

  getSingle<T>(url: string, id: string, params?: Record<string, any>
 ): Observable<T> {
    const fullUrl = `${this.baseUrl}/${url}/${id}`;
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return this.http.get<T>(fullUrl, { headers: this.createHeaders() });
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${url}`, body, {
      headers: this.createHeaders(),
    });
  }


  put<T>(url: string, id: string, body: any): Observable<T> {
    const fullUrl = `${this.baseUrl}/${url}/${id}`;
    return this.http.put<T>(fullUrl, body, { headers: this.createHeaders() });
  }

  // delete<T>(url: string, params?: Record<string, any>, token?: string): Observable<T> {
  delete<T>(url: string, id: string): Observable<T> {
    // const httpParams = new HttpParams({ fromObject: params || {} });
    const fullUrl = `${this.baseUrl}/${url}/${id}`;
    return this.http.delete<T>(fullUrl, {
      // params: httpParams,
      headers: this.createHeaders(),
    });
  }

  query<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${url}`, body, {
      headers: this.createHeaders(),
    });
  }

}
