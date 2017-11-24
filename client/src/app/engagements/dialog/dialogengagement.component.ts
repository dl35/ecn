import { Component,Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {EngagementsService  }  from '../../services/engagements.service' ;
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dialogengagement',
  templateUrl: './dialogengagement.component.html',
  styleUrls: ['./dialogengagement.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DialogengagementComponent  {

    params ={id:null, presence:null,extranat:null };



  constructor(  private engageService: EngagementsService,
    public dialogRef: MatDialogRef<DialogengagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

        this.params=data;
    console.log( this.params ) ;

     }

  onNoClick(): void {
    this.dialogRef.close('oko');
  }


setExtranat(e) {
  this.params.extranat=e.value;

  let data ={extranat:e.value };
  this.engageService.updateEngagement( this.params.id , data ).subscribe(
   ( response: any[] ) =>{
     
    console.log("ok");
     } ,

 (err: HttpErrorResponse)  => { 


 },
 () => {


 });


}

setPresence(e) {
   this.params.presence=e.value;
   let data ={presence:e.value };
   this.engageService.updateEngagement( this.params.id , data ).subscribe(
    ( response: any[] ) =>{
      
     console.log("ok");
      } ,

  (err: HttpErrorResponse)  => { 


  },
  () => {


  });



}

sendNotification(){
  console.log( "notif..." );
}


}
