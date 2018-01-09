import { Component, OnInit ,ViewChild,    ElementRef} from '@angular/core';
import { FormBuilder, FormControl , FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import {MailtoService  }  from '../services/mailto.service' ;

import {QuillModule} from 'ngx-quill';
@Component({
  selector: 'app-mailto',
  templateUrl: './mailto.component.html',
  styleUrls: ['./mailto.component.css']
})
export class MailtoComponent implements OnInit {


  private mailForm: FormGroup;
 

  private licencies=null; 
  private from=null;
  private datas={'from':null,'lic':null,'comp':null,'filtre':[{'n':'av','v':'Avenirs' } ,{'n':'je','v':'Jeunes' },{'n':'ju','v':'Juniors' },{'n':'se','v':'Seniors' },{'n':'ma','v':'Masters' }, {'n':'of','v':'Officiels' }              ]} 
  private selectAll=false;

  quilltoobar={
    toolbar: [
      ['bold', 'italic','underline', 'strike'],['link'],[{ 'align': [] }],[{ 'list': 'ordered'}, { 'list': 'bullet' }]
    ]
  };



  constructor( private formBuilder: FormBuilder, private mailtoService: MailtoService , private snackBar: MatSnackBar  ) {}

  ngOnInit() {

    this.createForm();

    this.mailtoService.get().subscribe(
      ( datas: any ) =>{
        this.licencies=datas.lic;
        this.datas.lic=datas.lic;
        this.datas.comp=datas.comp;
        this.datas.from=datas.from;
        this.showSnackBar('initialisation ok', true );
        } ,
  
    (err: HttpErrorResponse)  => { 
     
      if (err.error instanceof Error) {
        this.showSnackBar('Client side: '+err.status+':'+err.statusText,false);
      } else {
        this.showSnackBar('Server side: '+err.status+':'+err.statusText,false);
      }

     },
    () => {


    });

  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private createForm() {
  this.mailForm = this.formBuilder.group({
    body: [null, Validators.required], 
    subject:  [null, Validators.required], 
    idcompet: [null]  ,
    type :this.formBuilder.group( {'at': true ,'ok': true ,'ko': true }  ),
    idlic: this.formBuilder.array([]),
    from: [null, Validators.required], 

  },
  {validator:this.myValidator}
);

}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private myValidator(myform: FormControl ): any {
    let tarray = <FormArray> myform.get('idlic') ;  
    let gtype = <FormGroup> myform.get('type') ;  
    if (  !myform.get('idcompet').value &&  tarray.length === 0 )  return {formError:true} ;
    else  if ( myform.get('idcompet').value  && gtype.get('ok').value === false && gtype.get('ko').value === false && gtype.get('at').value === false )
    return {typeError:true};
    else null;
      }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private showSnackBar( message , info)
{
  let style= 'snack-success';
  if ( !info )  style='snack-error';
  this.snackBar.open( message  , '', {
    duration: 2000,
    extraClasses: [ style ]
  });

}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private sendMail() {

  let json=  this.mailForm.value ;
  ( json.idcompet ) ? delete json.idlic  : delete json.type  ;
 
  this.mailtoService.post( json ).subscribe(
    ( datas: any ) =>{
      this.showSnackBar( datas.message  , true );
      this.mailForm.get('body').setValue('') ;
      
      } ,

  (err: HttpErrorResponse)  => { 
   
    if (err.error instanceof Error) {
      this.showSnackBar('Client side: ' +err.status+':'+err.statusText, false );
    } else {
      this.showSnackBar('Server side: ' +err.status+':'+err.statusText  , false );
    }

   },
  () => {
  
  });

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
createItem_old( value): FormGroup {
  return this.formBuilder.group({
    id: value 
  });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private createItem( value): FormControl {
  return new FormControl ( value) 
  };

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private setChange(value){
  let tarray = <FormArray>this.mailForm.get('idlic') ;  
  let remove =false;
  for(var i=0;i<tarray.length;i++ )
   {
    if( tarray.at(i).value === value  ) {remove=true;tarray.removeAt(i); break ;}
   }
   
  if( ! remove ) 
   tarray.push( this.createItem(value) ) ;
  
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private addAll() {
  this.removeAll()
  let tarray=<FormArray>this.mailForm.get('idlic') ;  
  let alic=this.datas.lic;
  for(let i=0 ; i < alic.length ; i++ )
   tarray.push( this.createItem(alic[i].id) ) ;

  }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private removeAll() {
  let tarray=<FormArray>this.mailForm.get('idlic') ;  
   while (0 !== tarray.length) {
    tarray.removeAt(0);
  }
 
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private setFilter(p) {
  this.removeAll();

  if ( p.value === '-1')
  {
    this.datas.lic=this.licencies;
    return;
  }

  let values=[]; 
  let d=this.licencies;
  for (var i = 0; i < d.length ; i++) {
   let item = d[i];
    if( item.categorie.toLowerCase() === p.value )  
    {
      values.push(item);
    }  

  }
  
 this.datas.lic=values;
 this.selectAll=false;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private getErrorSubject() {
  return this.mailForm.get('subject').hasError('required') ? 'Saisir un sujet' :'';
  
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private getErrorType() {
  return this.mailForm.hasError('typeError') ? 'Au moins un critère' :'';
  
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private getErrorForm() {
  return this.mailForm.hasError('formError') ? 'Choisir une compétition ou faire une sélection' :'';
  
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





}
