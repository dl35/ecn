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
setExtranat(extra) {
 ( extra === '1') ? extra = '0' : extra = '1';
  this.engageService.extranatEngagement ( this.params.row.id , extra ).subscribe(
   ( response: any ) => {
       if ( response.success ) {
        this.params.row.extranat = extra;
       }

     } ,

 (err: HttpErrorResponse)  => {

  console.log( err );
 },
 () => {


 });


}

//////////////////////////////////////////////////////////////////////////
notify() {

  console.log( this.params.row.id_competitions , this.params.row.id ) ;

  this.engageService.notifyEngagement ( this.params.row.id_competitions , this.params.row.id ).subscribe(
    ( response: any ) => {
         if ( response.success ) {
            this.params.row.notification++;
         }
      } ,

  (err: HttpErrorResponse)  => {

  },
  () => {



  });
}
/////////////////////////////////////////////////////////////////////////
notifyAll() {
  this.reponse.progress = true;

  this.engageService.notifyallEngagement( this.params.idcompet ).subscribe(
    ( response: any ) => {

      console.log( '...........' , response );
      this.reponse.show = true;
      this.reponse.error = false;
      this.reponse.text = response.message;


      } ,

  (err: HttpErrorResponse)  => {

    console.log( err );
    this.reponse.show = true;
    this.reponse.error = true;
    this.reponse.text = err.error.message;
    this.reponse.progress = false;
  },
  () => {

    this.reponse.progress = false;

  });
}

}
