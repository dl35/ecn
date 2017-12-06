import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import {MailtoService  }  from '../services/mailto.service' ;


@Component({
  selector: 'app-mailto',
  templateUrl: './mailto.component.html',
  styleUrls: ['./mailto.component.css']
})
export class MailtoComponent implements OnInit {


   licencies=null; 
   datas={'lic':null,'comp':null,'filtre':[{"n":"av","v":"Avenirs" } ,{"n":"je","v":"Jeunes" },{"n":"ju","v":"Juniors" },{"n":"se","v":"Seniors" },{"n":"ma","v":"Masters" }, {"n":"of","v":"Officiels" }              ]} 
   selectedOption='-1';
   selectAll=false;
  constructor( private mailtoService: MailtoService , private snackBar: MatSnackBar  ) {}

  ngOnInit() {

    this.mailtoService.get().subscribe(
      ( datas: any ) =>{
        this.licencies=datas.lic;
        this.datas.lic=datas.lic;
        this.datas.comp=datas.comp;
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


private test(e){

console.log(e);

}

private setFilter(p) {
  
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

private selectAllLic() {


}







}
