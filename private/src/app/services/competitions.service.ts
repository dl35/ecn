import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


export interface MessageResponse {
  success: boolean;
  message: string;
  }

@Injectable()
export class CompetitionsService {

  constructor(private http: HttpClient) {}

public list() {
 return  this.http.get('/api/private/competitions') ;
}

public store(json) {
  if ( json.id == null ) {
      return this.post(json);
   } else {
     return this.put(json);
  }

}

private post(json) {
   const url = '/api/private/competitions';
   return  this.http.post( url , json ) ;
  }


private put(json) {
  const url = '/api/private/competitions/' + json.id;
  return  this.http.put<MessageResponse>( url , json ) ;
  }

public delete(id) {
    const url = '/api/private/competitions/' + id;
    return  this.http.delete<MessageResponse>( url ) ;
    }

}

