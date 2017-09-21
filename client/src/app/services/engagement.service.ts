import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";



@Injectable()
export class EngagementService {

  constructor(private http: HttpClient) { 
  }

  get() {

      let url='/api/public/competitions/145/456' ;  
      return this.http.get( url  );
      
}

}
