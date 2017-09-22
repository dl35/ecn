import { Component, OnInit, ViewChild ,ElementRef  } from '@angular/core';
import { LicenciesService  }  from '../services/licencies.service' ;
import { MdSort,MdSnackBar,MdPaginator } from '@angular/material';
import { FormBuilder, FormControl , FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import {DataSource} from '@angular/cdk/table';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';


@Component({
  selector: 'app-licencies',
  templateUrl: './licencies.component.html',
  styleUrls: ['./licencies.component.css']
})
export class LicenciesComponent implements OnInit {

  public dataForm: FormGroup ;
  public dataSource: MyDataSource ;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdPaginator) paginator: MdPaginator;

  meta={
    displayForm : false ,
    total : 0,
    totdisp :0
  }

  

  constructor( private formBuilder: FormBuilder, private licservice: LicenciesService , private snackBar: MdSnackBar  ) {

          
       }

 
  ngOnInit() {
    
    
    
    //      this.initForm();
    
          this.licservice.list().subscribe(
          ( data: any[] ) =>{ this.meta.total = data.length ; this.meta.totdisp = data.length ;   this.dataSource = new MyDataSource(data ,  this.sort , this.paginator) ;
          
            Observable.fromEvent(this.filter.nativeElement, 'keyup')
            .debounceTime(150)
            .distinctUntilChanged()
            .subscribe(() => {
              if (!this.dataSource) { return; }
              this.dataSource.filter = this.filter.nativeElement.value;
            });
          
          },  
          (err: HttpErrorResponse)  => { 
            if (err.error instanceof Error) {
              this.showSnackBar("Client-side:" +err.status+":"+err.statusText, false );
            } else {
              this.showSnackBar("Server-side: " +err.status+":"+err.statusText  , false );
            }
      
           },
          () => {
              console.log("end ok " + this.dataSource   ) ;
            //  console.log("search Id .... " + this.updateForm (10)  );
             // console.log("search Id .... " + Object.keys ( this.searchId(10) )  );
            // this.updateForm (10) 
             
    
    
          });
    
      }

      showSnackBar( message , info)
      {
          let style= "snack-success";
        if ( !info )  style="snack-error";
      
        this.snackBar.open( message  , "", {
          duration: 2000,
          extraClasses: [ style ]
          
        });
      
      }





}



export class MyDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }


  constructor(public datas: any[] , private mysort: MdSort ,private mypaginator:  MdPaginator) {
    super();

    this.mypaginator._intl.itemsPerPageLabel="items / page";
  }


  connect(): Observable<Element[]> {
    //return Observable.of(this.datas);

    const displayDataChanges = [
     // this.datas,
      this.mysort.mdSortChange,
      this._filterChange,
      this.mypaginator.page
    ];

    return Observable.merge(...displayDataChanges).map((e) => {


      const datasorted =this.getSortedData(); 

      const datafilter  = datasorted.slice().filter((item: any) => {
        let searchStr = (item.nom + item.prenom + item.ville ).toLowerCase();
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
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'nom': [propertyA, propertyB] = [a.nom, b.nom]; break;
        case 'prenom': [propertyA, propertyB] = [a.prenom, b.prenom]; break;
        case 'date': [propertyA, propertyB] = [a.date, b.date]; break;
       // case 'progress': [propertyA, propertyB] = [a.progress, b.progress]; break;
       // case 'color': [propertyA, propertyB] = [a.color, b.color]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.mysort.direction == 'asc' ? 1 : -1);
    });
  }



  disconnect() {}
}