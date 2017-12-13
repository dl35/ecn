import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl , FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import {MailtoService  }  from '../services/mailto.service' ;


@Component({
  selector: 'app-mailto',
  templateUrl: './mailto.component.html',
  styleUrls: ['./mailto.component.css']
})
export class MailtoComponent implements OnInit {


  private mailForm: FormGroup;
  private licencies=null; 
  private from=null;
  private datas={'from':null,'lic':null,'comp':null,'filtre':[{"n":"av","v":"Avenirs" } ,{"n":"je","v":"Jeunes" },{"n":"ju","v":"Juniors" },{"n":"se","v":"Seniors" },{"n":"ma","v":"Masters" }, {"n":"of","v":"Officiels" }              ]} 
  private selectAll=false;


  constructor( private formBuilder: FormBuilder, private mailtoService: MailtoService , private snackBar: MatSnackBar  ) {}

  ngOnInit() {
    this.createForm();

    this.mailtoService.get().subscribe(
      ( datas: any ) =>{
        this.licencies=datas.lic;
        this.datas.lic=datas.lic;
        this.datas.comp=datas.comp;
        this.datas.from=datas.from;

        } ,
  
    (err: HttpErrorResponse)  => { 
     /*
      if (err.error instanceof Error) {
        this.showSnackBar("Client-side:" +err.status+":"+err.statusText, false );
      } else {
        this.showSnackBar("Server-side: " +err.status+":"+err.statusText  , false );
      }*/

     },
    () => {


    });

  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private createForm() {
  this.mailForm = this.formBuilder.group({
   
    body:  [null, Validators.required], 
    subject:  [null, Validators.required], 
    idcompet: '-1'  ,
    type :this.formBuilder.group( {"at": false ,"ok": false ,"ko": false }  ),
    idlic: this.formBuilder.array([]),
    from: [null, Validators.required], 

  },
  {validator: this.myValidator  }
);

}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private myValidator(myform: FormControl ): any {
    let tarray = <FormArray> myform.get('idlic') ;  
    let gtype = <FormGroup> myform.get('type') ;  
    if ( myform.get('idcompet').value == '-1' &&  tarray.length == 0 )  return {myError:true} ;
    else  if ( myform.get('idcompet').value != '-1' && gtype.get('ok').value == false && gtype.get('ko').value == false && gtype.get('at').value == false )
    return {myError:true};
    else null;
      }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
get type(): FormArray { return this.mailForm.get('type') as FormArray; }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private sendMail() {
  
console.log( JSON.stringify ( this.mailForm.value ) );

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
    if( tarray.at(i).value == value  ) {remove=true;tarray.removeAt(i); break ;}
   }
   
  if( ! remove ) 
   tarray.push( this.createItem(value) ) ;
  
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private addAll() {
  this.removeAll()
  let tarray = <FormArray>this.mailForm.get('idlic') ;  
  let alic=this.datas.lic;
  for(let i=0 ; i < alic.length ; i++ )
   tarray.push( this.createItem(alic[i].id) ) ;

  }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private removeAll() {
  let tarray = <FormArray>this.mailForm.get('idlic') ;  
   while (0 !== tarray.length) {
    tarray.removeAt(0);
  }
 
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private setFilter(p) {
  this.removeAll();

  if ( p.value == '-1')
  {
    this.datas.lic=this.licencies;
    return;
  }

  let values=[]; 
  let d =   this.licencies;
  for (var i = 0; i < d.length ; i++) {
   let item = d[i];
    if( item.categorie == p.value )  
    {
      values.push(item);
    }  

  }
  
 this.datas.lic=values;
 this.selectAll=false;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////








}
