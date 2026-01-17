import { Injectable } from '@angular/core';
import ApiService from "./../../../shared/services/api.service";
import { ApiReponse } from '../interface/api-reponse';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export default class UserService {
  private token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzZWY2ZTQ0MC0zNWVhLTQ3ZDgtOWNkNy03MWM1NDI3ZjY1NWMiLCJ1bmlxdWVfbmFtZSI6InN0cmluZyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJzdHJpbmciLCJyb2xlX2lkIjoiMCIsImp0aSI6ImRmYmQwODU1LWJmYWMtNDMzZi1iNDlmLTY4MjgyNTY3ODU0ZiIsImlhdCI6MTc2ODY3MTMwMCwiZXhwIjoxNzY4Njc0OTAwLCJpc3MiOiJodHRwczovL2FwaS55b3VyZG9tYWluLmNvbSIsImF1ZCI6Imh0dHBzOi8vYXBpLnlvdXJkb21haW4uY29tIn0.K2Ing8kyzfiwOhJsmG4t_ByOwIJZ72PEQAK_kGXJS1Q';
  constructor(private apiService: ApiService) { }

  getUsers(){
    return this.apiService.get<ApiReponse>('SystemUser',this.token).pipe(
      map((responese: ApiReponse) => responese.data)
    )
  }
}
