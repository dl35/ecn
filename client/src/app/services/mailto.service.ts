import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


export interface MessageResponse {
  success: boolean;
  message: string;
  }

@Injectable()
export class MailtoService {

  constructor(private http: HttpClient) {}



      get(){
        return  this.http.get('/api/private/mailto') ;
       }
    
       post(data){
         let url = '/api/private/mailto';
         return  this.http.post( url,data) ;

       }




}
