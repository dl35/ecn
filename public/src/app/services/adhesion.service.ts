import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


export interface MessageResponse {
  success: boolean;
  message: string;
  }



@Injectable()
export class AdhesionService {
  public url = '/api/public/adhesion';


  constructor(private http: HttpClient) {}
// get
  public get(id) {
    const gurl = this.url + '/' + id;
    return  this.http.get( gurl ) ;
  }
public store(obj) {

  if (obj.id === null ) {
      return this.post( obj );
  } else {
      return this.put(obj);
  }

}

// create
  private post(data) {
    return  this.http.post<MessageResponse>(this.url , data ) ;
  }

// update
private put(data) {
    return  this.http.put<MessageResponse>( this.url , data ) ;
  }

}
