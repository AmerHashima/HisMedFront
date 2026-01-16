import { Injectable } from '@angular/core';
import ApiService from "./../../../shared/services/api.service";
import { ApiReponse } from '../interface/api-reponse';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export default class UserService {

  constructor(private apiService: ApiService) { }

  getUsers(){
    return this.apiService.get<ApiReponse>('SystemUser').pipe(
      map((responese: ApiReponse) => responese.data)
    )
  }
}
