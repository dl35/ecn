import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


export interface MessageResponse {
  success: boolean;
  message: string;
  }

@Injectable()
export class CompetitionsService {

  constructor(private http: HttpClient) {}

//  this.http.post(this.url, this.payload).subscribe();




list(){
 return  this.http.get('/api/private/competitions') ;
}




store(json ) {

if (json.id == "-1"  )  return this.post(json)
else return this.put(json);

}

private post( json ){
  
   let url = '/api/private/competitions';
   return  this.http.post( url , json ) ;
  
  /*
   http
   .post('/api/items/add', body, {
     headers: new HttpHeaders().set('Authorization', 'my-auth-token'),
   })
*/

  }


private put ( json ){
  
   let url = '/api/private/competitions/'+json.id;
   return  this.http.put<MessageResponse>( url , json ) ;
  
  /*
   http
   .post('/api/items/add', body, {
     headers: new HttpHeaders().set('Authorization', 'my-auth-token'),
   })
*/

  }

  delete( id ){
    
     let url = '/api/private/competitions/'+id;
     return  this.http.delete<MessageResponse>( url ) ;
    
    /*
     http
     .post('/api/items/add', body, {
       headers: new HttpHeaders().set('Authorization', 'my-auth-token'),
     })
  */
  
    }



}

/*

exemple
import { Hero } from "../../models/hero";

@Injectable()
export class HerosService {

  private readonly URL = "http://localhost:8080/api/heros"

  constructor(
    protected httpClient: HttpClient,
  ) {}

  public create(hero: Hero): Observable<Hero> {
    return this.httpClient.post<Hero>(this.URL, hero);
  }

  public delete(hero: Hero): Observable<Hero> {
    return this.httpClient.delete<Hero>(`${this.URL}/${hero._id}`);
  }

  public get(id: string): Observable<Hero> {
    return this.httpClient.get<Hero>(`${this.URL}/${id}`);
  }

  public list(): Observable<Array<Hero>> {
    return this.httpClient.get<Array<Hero>>(this.URL);
  }

  public update(hero: Hero): Observable<Hero> {
    return this.httpClient.put<Hero>(`${this.URL}/${hero._id}`, hero);
  }
*/