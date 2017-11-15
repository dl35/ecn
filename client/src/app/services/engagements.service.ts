import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EngagementsService {

  constructor(private http: HttpClient) {}





  listCompetitions(){
    return  this.http.get('/api/private/competitions') ;
   }



   getEngagement( id ){
    return  this.http.get('/api/private/engagements/'+id) ;
   }

   createEngagement( data ){
      // post data.id et data.filtre 
    return  this.http.post('/api/private/engagements' , data) ;
   }

    appendEngagement( idLicencie ){
    // ajoute une liste de licencies
    let data={};
     return  this.http.post('/api/private/engagements' , data) ;
    }

    delete( id ){
      // ajoute une liste de licencies
       return  this.http.delete ('/api/private/engagements/'+id ) ;
    }

    remove( id ){
      // ajoute une liste de licencies
       return  this.http.delete ('/api/private/engagements/'+id ) ;
    }




}
