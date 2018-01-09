import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EngagementsService {

  constructor(private http: HttpClient) {}





  listCompetitions(){
    return  this.http.get('/api/private/engagements') ;
   }



   getEngagement( id ){
    return  this.http.get('/api/private/engagements/'+id) ;
   }


   createEngagement( id,data ){
      // post data.id et data.filtre 
    return  this.http.post('/api/private/engagements/'+id , data) ;

   }

    updateEngagement( id,json ){
    return  this.http.put('/api/private/engagements/'+id , json) ;
    }

    removeAll( id ){
      // delete tous les engagements 
       return  this.http.delete ('/api/private/engagements/'+id ) ;
    }

    remove( id ){
      // delete 1 licencie de engagement
       return  this.http.delete ('/api/private/engagements/'+id ) ;
    }




}
