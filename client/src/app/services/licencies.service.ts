import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';




@Injectable()
export class LicenciesService {

  constructor(private http: HttpClient) {}

  list(){
    return  this.http.get('/api/private/licencies') ;
   }


}
