import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {EngagementsService  } from '../../services/engagements.service' ;
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dialogengagement',
  templateUrl: './dialogengagement.component.html',
  styleUrls: ['./dialogengagement.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DialogengagementComponent  {


  refresh= false;
  params= {idcompet: -1, row: null, option: null };
  reponse= {progress: false, show: false, error: null, text: null};

  categories = [
   {name: 'Avenir' , value: 'av' } ,
   {name: 'Jeune'  , value: 'je' } ,
   {name: 'Junior' , value: 'ju' },
   {name: 'Senior' , value: 'se' },
   {name: 'Master' , value: 'ma' }] ;





  // pour ajout
  paramAppend= {listecategories: [], listeselected: [], show: false, error: false, text: null};

  // pour delete
  paramDelete= {listecategories: [], listeselected: [], show: false, error: false, text: null};

  constructor(  private engageService: EngagementsService,
    public dialogRef: MatDialogRef<DialogengagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
        this.params = data;

console.log( this.params );

        if ( this.params.option === 'delete') {
            this.getLicencies( this.params.idcompet );
        }


     }


/////////////////////////////////////////////////////////////////////////////////
    add() {


this.engageService.append(this.params.idcompet,  this.paramAppend.listeselected ).subscribe(
  ( response: any ) => {

      this.paramAppend.show = true;
      this.paramAppend.error = false;
      this.paramAppend.text = response.message;
    } ,

  (err: HttpErrorResponse)  => {
      this.paramAppend.show = true;
      this.paramAppend.error = true;
      this.paramAppend.text = err.error.message;
},
  () => {
      this.paramAppend.listecategories = [];
      this.paramAppend.listeselected = [];
  });


    }

//////////////////////////////

changeCat(value) {
  this.paramAppend.show = false;
  this.paramAppend.error = false;
  this.paramAppend.text = null;
  this.getCategories( this.params.idcompet  , value );

}
/////////////////////////////

getCategories(idcompet, cat) {

this.engageService.getCategories(idcompet,  cat ).subscribe(
     ( response: any[] ) => {

      console.log( response );
      this.paramAppend.listecategories = response;

       } ,

   (err: HttpErrorResponse)  => {

    console.log( err );
   },
   () => {


   });


  }
/////////////////////////////////////////////////////////////////////////
delete() {



  this.engageService.delete ( this.params.idcompet , this.paramDelete.listeselected  ).subscribe(
    ( response: any ) => {

      this.paramDelete.show = true;
      this.paramDelete.error = false;
      this.paramDelete.text = response.message;
    } ,

  (err: HttpErrorResponse)  => {
      this.paramDelete.show = true;
      this.paramDelete.error = true;
      this.paramDelete.text = err.error.message;
},
  () => {
      this.paramDelete.listecategories = [];
      this.paramDelete.listeselected = [];
  });
}


/////////////////////////////////////
getLicencies(idcompet) {
  this.engageService.getLicencies( this.params.idcompet).subscribe(
    ( response: any[] ) => {

        if ( response.length === 0 ) {
          this.paramDelete.show = true;
          this.paramDelete.text = 'Notifications effectuées ,suppression impossible';
        }

        this.paramDelete.listecategories = response;

    } ,

  (err: HttpErrorResponse)  => {
      this.paramDelete.show = true;
      this.paramDelete.error = true;
      this.paramDelete.text = err.error.message;
},
  () => {

  });


}


/////////////////////////////////////////////////////////////////////////////////
addEngage(e) {



  const data = {append: null};
    this.engageService.updateEngagement( this.params.row.id , data ).subscribe(
     ( response: any[] ) => {

       } ,

   (err: HttpErrorResponse)  => {


   },
   () => {


   });


  }

/////////////////////////////////////////////////////////////////////////////////
setExtranat(e) {


const old = this.params.row.extranat ;
( e === '1' ) ? this.params.row.extranat = '0' : this.params.row.extranat = '1';
const data = {extranat: this.params.row.extranat };
  this.engageService.updateEngagement( this.params.row.id , data ).subscribe(
   ( response: any[] ) => {

     } ,

 (err: HttpErrorResponse)  => {


 },
 () => {


 });


}

//////////////////////////////////////////////////////////////////////////
sendNotification() {
  const data = {notify: this.params.row.id };
  console.log( data);
  this.engageService.updateEngagement( this.params.row.id_competitions , data ).subscribe(
    ( response: any[] ) => {

      this.params.row.notification++;
      } ,

  (err: HttpErrorResponse)  => {

    console.log('error');
  },
  () => {



  });
}
/////////////////////////////////////////////////////////////////////////
sendAllNotification() {
  const data = {notifyall: true };
  this.reponse.progress = true;

  this.engageService.updateEngagement( this.params.idcompet , data ).subscribe(
    ( response: any ) => {

      console.log( '...........' , response );
      this.reponse.show = true;
      this.reponse.error = false;
      this.reponse.text = response.info;


      } ,

  (err: HttpErrorResponse)  => {

    console.log( err );
    this.reponse.show = true;
    this.reponse.error = true;
    this.reponse.text = err.error.message;
    this.reponse.progress = false;
  },
  () => {
console.log( 'denis....');
    this.reponse.progress = false;

  });
}

}
