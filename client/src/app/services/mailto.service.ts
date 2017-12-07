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
    
       post(id,data){
         
         let url = '/api/private/mailto/'+id;
         return  this.http.post( url,data) ;

       }




}
