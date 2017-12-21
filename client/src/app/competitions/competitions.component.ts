import { Component, OnInit, ViewChild ,ElementRef  } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {DataSource} from '@angular/cdk/table';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';


import {CompetitionsService , MessageResponse }  from '../services/competitions.service' ;



import { MatSort ,MatSnackBar ,MatPaginator } from '@angular/material';



import { FormBuilder, FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';


@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.css']
})
export class CompetitionsComponent implements OnInit {

  public dataForm: FormGroup ;
  public dataSource: MyDataSource ;
  public futures:boolean=false;
  public verifiees:boolean=false;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor( private formBuilder: FormBuilder, private compService: CompetitionsService , private snackBar: MatSnackBar  ) {

     // this.dateAdapter.setLocale('fr-FR');



   }



  minDate = new Date(2017, 8, 1);
  maxDate = new Date(2018, 7, 31);

  meta={
    displayForm : false ,
    "bassin":[{"name":"25" ,"value":"25"  } , {"name":"50" ,"value":"50"  }  ] ,
    "type": [{"name":"Stage" ,"value":"stage" } , {"name":"Compétition" ,"value":"compet"  } ] ,
    "entraineur": [{"name":"E1" ,"value":"e1@test.fr"  } , {"name":"E2" ,"value":"e2@test.fr"   } , {"name":"E3" ,"value":"e3@test.fr"   }] ,
    total : 0,
    totdisp :0
  };

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  createForm() {
    //Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$') , 
    this.dataForm = this.formBuilder.group({
      id: [ -1 ],
      nom: ['', [Validators.required,  Validators.minLength(5)] ],
      lieu:  ['', [Validators.required, Validators.minLength(4)] ],
      //categories: new FormArray[ {t:new FormControl("10")}   ]   , 
      categories: new FormGroup({
        av: new FormControl(false),
        je: new FormControl(true),
        dep: new FormControl(false),
        reg: new FormControl(false),
        nat: new FormControl(false),
        ma: new FormControl(false)
      },this.catValidator),
      bassin:  [ "25" , [Validators.required] ],
      type:  [ "compet" , [ Validators.required ]] ,
      debut:  [ new Date() , [Validators.required] ],
      fin:  [ null  , [Validators.required] ],
      heure:  ['07', [Validators.required] ],
      limite:  [ null  , [Validators.required] ],
      verif:   [ false ] ,
      choixnages:  [ false  ],
      max:  [ 0  ],
      entraineur:  [ null, [Validators.required] ] ,
      lien:  [ null ] ,
      commentaires:  ['']
    },
    {validator: this.allDateValidator  }
  );
  this.setValidator();

 
  }
 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private catValidator(gcat: FormGroup ) {

 let res=false;
   Object.keys( gcat.controls).forEach(key => {
     if( gcat.get(key).value ) { res=true;}
   });
   if (res)  return null  ;
   else  return {catError:true};
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private setValidator() {
    this.dataForm.get('type').valueChanges.subscribe(
        (type: string) => {
              if (type === 'compet') {
               this.dataForm.get('max').setValidators(null);
              } else  {
               this.dataForm.get('max').setValidators([Validators.required,Validators.pattern('^[1-9][0-9]*$')]);
              }
               this.dataForm.get('max').updateValueAndValidity();
          }
      )
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private  allDateValidator(input: FormControl ): any {

      var start , end , limite;
      if ( input.get('debut').value === null || input.get('fin').value === null  || input.get('limite').value === null  ) 
      {
        return null;
      }
      
      start = Date.parse( input.get('debut').value);
      end = Date.parse( input.get( 'fin' ).value);
      limite = Date.parse( input.get( 'limite' ).value);

      return  ( start <=  end && limite < start  ) ?  null :  {dateError:true};
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private onDateStart(event: MatDatepickerInputEvent<Date> ) {
  let start=new Date(event.value);
  if( this.dataForm.get('fin').value === null  )
  {
    this.dataForm.get('fin').setValue( start ) ;
  }


  if( this.dataForm.get('limite').value === null )
  {
    let limite=new Date(start);
    limite.setDate( limite.getDate()-10 );
    this.dataForm.get('limite').setValue( limite ) ;
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private setVerif() {
    
if( this.dataForm.get('id').value === -1  )  
      {
        ( this.dataForm.get('verif').disabled  )  ? this.dataForm.get('verif').enable() : this.dataForm.get('verif').disable();this.dataForm.get('verif').setValue(false);
      }
  }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private cancelForm() {
  this.meta.displayForm=false;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private showSnackBar( message , info)
{
  let style= "snack-success";
  if ( !info )  style="snack-error";

  this.snackBar.open( message  , "", {
    duration: 2000,
    extraClasses: [ style ]
    
  });

}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private filterFutures() {
this.dataSource.future=this.futures;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private filterVerifiees() {
  this.dataSource.verifiees=this.verifiees;
  
  }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

private refreshData() {
  
            this.compService.list().subscribe(
              ( data: any[] ) =>{ 
                this.meta.total = data.length ; 
                this.meta.totdisp = data.length ;  
                this.dataSource = new MyDataSource(data ,  this.sort , this.paginator) ;
              },  
              (err: HttpErrorResponse)  => { 
                if (err.error instanceof Error) {
                  this.showSnackBar("Client-side:" +err.status+":"+err.statusText, false );
                } else {
                  this.showSnackBar("Server-side: " +err.status+":"+err.statusText  , false );
                }
          
               },
              () => {
                      
        
        
              });
  
          }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private saveForm() {

this.meta.displayForm=false;
let obj = this.dataForm.value ;
Object.keys(obj).forEach(function (key) {
  if(typeof obj[key] === 'undefined'  ||  obj[key] === null  ){
     delete obj[key];
   }
 });

   console.log( "save from" ,JSON.stringify( obj )  );
  this.compService.store( obj ).subscribe( 
    
    ( data: MessageResponse )  =>
      { console.log( JSON.stringify(data)  ) ;
        this.showSnackBar( data.message  , data.success );  
        this.refreshData(); 
      },
    (err: HttpErrorResponse)  => { 
      if (err.error instanceof Error) {
        this.showSnackBar("Client-side error occured.", false );
      } else {
        this.showSnackBar("Server-side error occured." +err.statusText  , false );
      }

     },
  () => {
      
     
  });




}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private updateForm( id )  {


 this.dataForm.reset();  

  if( id != -1 )
  {  
      let response= this.searchId( id ) ;
      this.dataForm.setValue(response, { onlySelf: true });   
     
      if ( this.dataForm.get('type').value  === 'compet')
      {
        this.meta.type =  [ {"name":"Compétition" ,"value":"compet"  } ] ;
      }
      else 
      {
        this.meta.type =  [{"name":"Stage" ,"value":"stage" }  ] ;
      }
 
  }

  else {
          this.dataForm.get('id').setValue(-1);
          this.dataForm.get('type').setValue('compet');
          this.dataForm.get('type').enable();
          this.dataForm.get('bassin').setValue('25');

          this.dataForm.get('max').setValue(0);
          this.dataForm.get('verif').setValue(false);
          this.dataForm.get('verif').disable();

          this.dataForm.get('choixnages').setValue(false);
       //   this.dataForm.get('categories').setValue( this.meta.categories );
          this.meta.type =  [{"name":"Stage" ,"value":"stage" } , {"name":"Compétition" ,"value":"compet"  } ] ;

        }

        this.meta.displayForm=true;
 }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private searchId( id )  {
      let item :any ;
      const d =   this.dataSource.datas;
      for (var i = 0; i < d.length ; i++) {
     
        if( d[i].id === id )  
        {
            
          item =Object.assign({}, d[i]);  
          
          ( item.verif === '0' ) ? item.verif = false : item.verif = true ;
          ( item.choixnages === '0' ) ? item.choixnages = false : item.choixnages = true ;
         //  item.debut = new Date( item.debut );
         //  item.fin = new Date( item.fin );
        //   item.limite = new Date( item.limite );

          delete item.del;

          break;
        }  

      }



      return item ;

}
 deleteItem( id ) {
 }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

public ngOnInit() {

      this.createForm();
      this.dataForm.valueChanges
       .debounceTime(400)
      .distinctUntilChanged()
      .subscribe(data => {
       
        if ( this.meta.displayForm ) 
        {
          console.log('Form changes', data)

        }
       
      })

      this.compService.list().subscribe(
        ( data: any[] ) =>{this.meta.total = data.length ; this.meta.totdisp = data.length ;   this.dataSource = new MyDataSource(data ,  this.sort , this.paginator) ;
          
            Observable.fromEvent(this.filter.nativeElement, 'keyup')
            .debounceTime(150)
            .distinctUntilChanged()
            .subscribe(() => {
              if (!this.dataSource) { return; }
              this.dataSource.filter = this.filter.nativeElement.value;
              this.dataSource.future =this.futures ;
            });
          
           /* Observable.of(this.futures )
            .debounceTime(150)
            .distinctUntilChanged()
            .subscribe(() => {
              if (!this.dataSource) { return; }
            
              this.dataSource.future =this.futures ;
            });*/




          } ,
    
      (err: HttpErrorResponse)  => { 
        if (err.error instanceof Error) {
          this.showSnackBar("Client-side:" +err.status+":"+err.statusText, false );
        } else {
          this.showSnackBar("Server-side: " +err.status+":"+err.statusText  , false );
        }
  
       },
      () => {
          console.log("end ok " + this.dataSource.datas   ) ;
        //  console.log("search Id .... " + this.updateForm (10)  );
         // console.log("search Id .... " + Object.keys ( this.searchId(10) )  );
        // this.updateForm (10) 
         


      });

  }

}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export class MyDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  _futureChange = new BehaviorSubject(false);
  get future(): boolean { return this._futureChange.value; }
  set future( future: boolean ) { this._futureChange.next(future); }

  _verifieesChange = new BehaviorSubject(false);
  get verifiees(): boolean { return this._verifieesChange.value; }
  set verifiees( verifiees: boolean ) { this._verifieesChange.next(verifiees); }


  constructor(public datas: any[] , private mysort: MatSort ,private mypaginator:  MatPaginator) {
    super();

    this.mypaginator._intl.itemsPerPageLabel="items / page";
  }


  connect(): Observable<Element[]> {
     

    const displayDataChanges = [
      this.datas,
      this.mysort.sortChange,
      this._filterChange,
      this._futureChange,
      this._verifieesChange,
      this.mypaginator.page
    ];

    return Observable.merge(...displayDataChanges).map((e) => {
      
      const datasorted = this.getSortedData(); 

      const datafutures  = datasorted.slice().filter((item: any) => {
        let fut = true;
        if( this.future )
        { 
           fut =( new Date(item.debut) >= new Date() ) ;
        }
        return fut;
      });

      const dataverifiees  = datafutures.slice().filter((item: any) => {
        let verif = true;
        if( this.verifiees )
        { 
           verif =(item.verif === '1' );
        }
        return verif;
      });

      const datafilter  = dataverifiees.slice().filter((item: any) => {
        let searchStr = (item.nom +" "+ item.lieu +" "+ item.type ).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });
      this.mypaginator.length =datafilter.length;
      
      if(this.mypaginator.pageIndex * this.mypaginator.pageSize >  this.mypaginator.length ) this.mypaginator.pageIndex =0;

      const startIndex = this.mypaginator.pageIndex * this.mypaginator.pageSize;
      return datafilter.splice(startIndex, this.mypaginator.pageSize);





    });;

  }


  getSortedData(): Element[] {
    if (!this.mysort.active || this.mysort.direction === '') { return this.datas; }
   
    const data = this.datas.slice();
   
    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';


      switch (this.mysort.active) {
        
        case 'nom': [propertyA, propertyB] = [a.nom.toLowerCase(), b.nom.toLowerCase()]; break;
        case 'lieu': [propertyA, propertyB] = [a.lieu.toLowerCase(), b.lieu.toLowerCase()]; break;
        case 'bassin': [propertyA, propertyB] = [a.bassin, b.bassin]; break;
        case 'type': [propertyA, propertyB] = [a.type, b.type]; break;
        case 'debut': [propertyA, propertyB] = [a.debut, b.debut]; break;
        case 'fin': [propertyA, propertyB] = [a.fin, b.fin]; break;
       
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.mysort.direction === 'asc' ? 1 : -1);
    });
  }



  disconnect() {}
}
