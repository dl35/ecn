import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface MessageResponse {
  success: boolean;
  message: string;
  }

@Injectable()
export class EngagementsService {

  constructor(private http: HttpClient) {}




  // liste des competitions à venir
  listCompetitions() {
    return  this.http.get('/api/private/engagements') ;
   }


  // engagements d'une competition
   getEngagement( id ) {
    return  this.http.get('/api/private/engagements/' + id) ;
   }

   // categories pour ajouter
   getCategories( id, cat ) {
    return  this.http.get('/api/private/engagements/' + id + '/' + cat) ;
   }

   // licencies pour delete
   getLicencies ( id ) {
    return  this.http.get('/api/private/engagements/' + id + '/delete') ;
   }


   create( id, data ) {
    return  this.http.post<MessageResponse>('/api/private/engagements/' + id , data) ;
   }

   // ajoute liste licencies
   append( idcompet, data ) {
    return  this.http.post<MessageResponse>('/api/private/engagements/' + idcompet + '/append' , data) ;
  }


  notifyallEngagement( idcompet ) {
    const mode = {notifyall: true};
    return  this.http.put('/api/private/engagements/' + idcompet , mode ) ;
    }

  notifyEngagement( idcompet, idengage ) {
    const mode = {notify: idengage};
    return  this.http.put('/api/private/engagements/' + idcompet , mode) ;
    }

  extranatEngagement( idengage, value ) {
    const mode = {extranat : value };
    return  this.http.put('/api/private/engagements/' + idengage , mode ) ;
    }


   delete( idcompet , listlicencies ) {
      // delete une liste de licencies de engagement
       return  this.http.delete('/api/private/engagements/' + listlicencies ) ;
    }




}
