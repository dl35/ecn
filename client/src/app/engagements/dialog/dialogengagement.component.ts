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

  

  params={idcompet:-1,row:null,datas:null };
  reponse={progress:false,show:false,error:null,text:null};
  
  categories =[ 
   {name:'Avenir' ,value:'AV' } ,
   {name:'Jeune'  ,value:'JE' } ,
   {name:'Junior' ,value:'JU' },
   {name:'Senior' ,value:'SE' },
   {name:'Master' ,value:'MA' }] ;


  constructor(  private engageService: EngagementsService,
    public dialogRef: MatDialogRef<DialogengagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

        
    this.params=data;
    
    console.log("params " , this.params ) ;

     }

  onNoClick(): void {
    this.dialogRef.close('oko');
  }







/////////////////////////////////////////////////////////////////////////////////
setExtranat(e) {


let old =this.params.row.extranat ;
( e == '1' ) ? this.params.row.extranat="0" :this.params.row.extranat="1";
let data ={extranat:this.params.row.extranat };
  this.engageService.updateEngagement( this.params.row.id , data ).subscribe(
   ( response: any[] ) =>{
        
     } ,

 (err: HttpErrorResponse)  => { 


 },
 () => {

 
 });


}

//////////////////////////////////////////////////////////////////////////
sendNotification(){
  let data ={notify: this.params.row.id };
  console.log( data);
  this.engageService.updateEngagement( this.params.row.id_competitions , data ).subscribe(
    ( response: any[] ) =>{
      
      this.params.row.notification++;
      } ,

  (err: HttpErrorResponse)  => { 

    console.log("error");
  },
  () => {

   

  });
}
/////////////////////////////////////////////////////////////////////////
sendAllNotification(){
  let data ={notifyall: true };
  this.reponse.progress=true;

  this.engageService.updateEngagement( this.params.idcompet , data ).subscribe(
    ( response: any ) =>{
        
      console.log( "..........." , response );
      this.reponse.show=true;
      this.reponse.error=false;
      this.reponse.text=response.info;
     
    
      } ,

  (err: HttpErrorResponse)  => { 

    console.log( err );
    this.reponse.show=true;
    this.reponse.error=true;
    this.reponse.text=err.error.message;
    this.reponse.progress=false;
  },
  () => {
console.log( "denis....");
    this.reponse.progress=false;

  });
}


}

