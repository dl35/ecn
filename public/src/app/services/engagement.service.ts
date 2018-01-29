import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


export interface MessageResponse {
  success: boolean;
  message: string;
  }

  export interface DataResponse {
    success: boolean;
    data: {
          idcompet: number ,
          idengage: string,
          date: [{ date: Date , value: string }]
        };
    }

@Injectable()
export class EngagementService {

  public url = '/api/public/engagement';


  constructor(private http: HttpClient) {}
// get
  public get(idcompet, idengage ) {
    const gurl = this.url + '/' + idcompet + '/' + idengage ;
    return  this.http.get<DataResponse>( gurl ) ;
  }

// update
  public put( data ) {
   return  this.http.put<MessageResponse>( this.url, data  ) ;
  }

}
