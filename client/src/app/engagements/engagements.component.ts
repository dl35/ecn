import { Component, OnInit, ViewChild ,ElementRef  } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {DataSource} from '@angular/cdk/table';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import {EngagementsService  }  from '../services/engagements.service' ;



import { MatSort ,MatSnackBar ,MatPaginator } from '@angular/material';



import { FormBuilder, FormControl , FormGroup, Validators } from '@angular/forms';
import { forEach } from '@angular/router/src/utils/collection';



@Component({
  selector: 'app-engagements',
  templateUrl: './engagements.component.html',
  styleUrls: ['./engagements.component.css']
})
export class EngagementsComponent implements OnInit {

  public dataForm: FormGroup ;
  public dataSource: MyDataSource ;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;




  meta={
    displayForm : false ,
    competitions:[],
    engagements:[],
    total : 0,
    totdisp :0
  };


  constructor( private formBuilder: FormBuilder, private engageService: EngagementsService , private snackBar: MatSnackBar  ) {
    
         // this.dateAdapter.setLocale('fr-FR');
    
    
    
       }

  ngOnInit() {

    this.initForm();


    this.engageService.listCompetitions().subscribe(
      ( datas: any[] ) =>{
        this.meta.competitions=datas;
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


  initForm() {
    
        this.dataForm = this.formBuilder.group({
          av1:false,
          av2:false,
          je1:false,
          je2:false,
          je3:false,
          ju1:false,
          ju2:false,
          ju3:false,
          ju4:false,
          se1:false,
          se2:false,
          dep:false,
          reg:false,
          nat:false,
          ma:false
        } ,
       

        {
          validator: (formGroup: FormGroup) => {
            return this.validateCat (formGroup);
          }
        }) ;
     
    }

   private  changeCompet(e) {
       
     if ( this.meta.displayForm )  this.meta.displayForm=false; 
         
        let id = e.value;
        this.engageService.getEngagement(id).subscribe(
          ( response: any[] ) =>{
             
            if ( response.length == 0 ) { if ( !this.meta.displayForm )  this.meta.displayForm=true; }
            else     this.dataSource = new MyDataSource( response ,  this.sort , this.paginator) ; 
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
            console.log( this.meta.engagements  );
    
        });
    }



saveForm() {
  console.log("save form..."+ this.dataForm.controls['av1'].value  ) ;
 
 /*
    this.engageService.createEngagement(id).subscribe(
      ( response: any[] ) =>{
        
        if ( response.length == 0 ) this.meta.displayForm=true;
        else  this.meta.engagements=response;
        } ,

    (err: HttpErrorResponse)  => { 


    },
    () => {


    });
*/

}


private validateCat(formGroup: FormGroup) {
  for (let key in formGroup.controls) {
    if (formGroup.controls.hasOwnProperty(key)) {
      let control: FormControl = <FormControl>formGroup.controls[key];
      if (control.value) {
        return null;
      }
    }
  }

  return {
    validateCat: {
      valid: false
    }
  };
}





}


export class MyDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }


  constructor(public datas: any[] , private mysort: MatSort ,private mypaginator:  MatPaginator) {
    super();

    this.mypaginator._intl.itemsPerPageLabel="items / page";
  }


  connect(): Observable<Element[]> {
     

    const displayDataChanges = [
      this.datas,
      this.mysort.sortChange,
      this._filterChange,
      this.mypaginator.page
    ];

    return Observable.merge(...displayDataChanges).map((e) => {

  

      const datasorted = this.getSortedData(); 

      const datafilter  = datasorted.slice().filter((item: any) => {
        let searchStr = (item.nom +" "+ item.lieu +" "+ item.type ).toLowerCase();
        //this.mypaginator.pageIndex =0 ;

        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });
      this.mypaginator.length =datafilter.length;
      
      if(this.mypaginator.pageIndex * this.mypaginator.pageSize >  this.mypaginator.length ) this.mypaginator.pageIndex =0;

      const startIndex = this.mypaginator.pageIndex * this.mypaginator.pageSize;
      return datafilter.splice(startIndex, this.mypaginator.pageSize);





    });;

  }


  getSortedData(): Element[] {
    if (!this.mysort.active || this.mysort.direction == '') { return this.datas; }
   
    const data = this.datas.slice();
    console.log ("sorted..."  );

   

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';



      switch (this.mysort.active) {
        
        case 'nom': [propertyA, propertyB] = [a.nom, b.nom]; break;
        case 'lieu': [propertyA, propertyB] = [a.lieu, b.lieu]; break;
        
       
       
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.mysort.direction == 'asc' ? 1 : -1);
    });
  }



  disconnect() {}
}
