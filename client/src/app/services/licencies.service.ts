import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


export interface MessageResponse {
  success: boolean;
  message: string;
  }

@Injectable()
export class LicenciesService {

  constructor(private http: HttpClient) {}

  public list(){
    return  this.http.get('/api/private/licencies') ;
   }

  public store(json ) {
    if (json.id == "-1"  )  return this.post(json)
    else return this.put(json);
    }

  private post ( json ){
      const url = '/api/private/licencies/'+json.id;
      return  this.http.post<MessageResponse>( url , json ) ;
  }


  private put ( json ){
    const url = '/api/private/licencies/'+json.id;
    return  this.http.put<MessageResponse>( url , json ) ;
  }


}
