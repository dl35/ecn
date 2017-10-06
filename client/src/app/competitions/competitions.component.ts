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



import { FormBuilder, FormControl , FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.css']
})
export class CompetitionsComponent implements OnInit {

  public dataForm: FormGroup ;
  public dataSource: MyDataSource ;

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
    "categories":{"av": false ,"je": false ,"dep": false,"reg": false,"ir": false,"nat": false,"ma": false } ,
    "type": [{"name":"Stage" ,"value":"stage" } , {"name":"Compétition" ,"value":"compet"  } ] ,
    "entraineur": [{"name":"E1" ,"value":"e1@test.fr"  } , {"name":"E2" ,"value":"e2@test.fr"   } , {"name":"E3" ,"value":"e3@test.fr"   }] ,
    total : 0,
    totdisp :0
  };


  initForm() {

    //Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$') , 

    this.dataForm = this.formBuilder.group({
      id: [ -1 ],
      nom: ['', [Validators.required,  Validators.minLength(5)] ],
      lieu:  ['', [Validators.required, Validators.minLength(4)] ],
     
     categories:  this.formBuilder.group( this.meta.categories  )  , 
     
      bassin:  [ "25" , [Validators.required] ],
      type:  [ "compet" , [ Validators.required ]] ,
      debut:  [ new Date('2017-05-12') , [Validators.required] ],
      fin:  [ new Date()   , [Validators.required] ],
      heure:  ['07', [Validators.required] ],
      limite:  [ new Date() , [Validators.required] ],
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

    allDateValidator(input: FormControl ): any {

      var start , end , limite;
      if ( input.get('debut').value == null || input.get('fin').value == null  || input.get('limite').value == null  ) 
      {
        return null;
      }
      
      start = Date.parse( input.get('debut').value);
      end = Date.parse( input.get( 'fin' ).value);
      limite = Date.parse( input.get( 'limite' ).value);
      if ( start >= end )  return {dateError:true};
      return  (limite > start  &&  limite < end ) ? null : { dateError:true} 

    }




    setVerif() {

    
      if( this.dataForm.get('id').value == -1  )  
      {
        ( this.dataForm.get('verif').disabled  )  ? this.dataForm.get('verif').enable() : this.dataForm.get('verif').disable();this.dataForm.get('verif').setValue(false);
      }



    }




  cancelForm() {

  this.meta.displayForm=false;

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


saveForm() {

this.meta.displayForm=false;
let obj = this.dataForm.value ;
Object.keys(obj).forEach(function (key) {
  if(typeof obj[key] === 'undefined'  ||  obj[key] === null  ){
     delete obj[key];
   }
 });





   console.log( JSON.stringify( obj )  );
  this.compService.store( obj ).subscribe( 
    
    ( data: MessageResponse )  =>  { console.log( JSON.stringify(data)  ) ;  this.showSnackBar( data.message  , data.success );  },
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






 updateForm( id )  {


 this.dataForm.reset();  

  if( id != -1 )
  {  
      let response= this.searchId( id ) ;
      this.dataForm.setValue(response, { onlySelf: true });   
     
      if ( this.dataForm.get('type').value  == 'compet ')
      {
        this.meta.type =  [ {"name":"Compétition" ,"value":"compet"  } ] ;
      }
      else 
      {
        this.meta.type =  [{"name":"Stage" ,"value":"stage" }  ] ;
      }

      

      console.log( response );
   
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
          this.dataForm.get('categories').setValue( this.meta.categories );
          this.meta.type =  [{"name":"Stage" ,"value":"stage" } , {"name":"Compétition" ,"value":"compet"  } ] ;

        }

        this.meta.displayForm=true;
 }


searchId( id )  {
      let item :any ;
      let d =   this.dataSource.datas;
      for (var i = 0; i < d.length ; i++) {
        item = d[i];
        if( item.id == id )  
        {
          ( item.verif == '0' ) ? item.verif = false : item.verif = true ;
          ( item.choixnages == '0' ) ? item.choixnages = false : item.choixnages = true ;
           item.debut = new Date( item.debut );
           item.fin = new Date( item.fin );
           item.limite = new Date( item.limite );
           

          break;
        }  

      }

      return item ;

}



 deleteItem( id ) {


 }






  ngOnInit() {



      this.initForm();

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
        ( data: any[] ) =>{ this.meta.total = data.length ; this.meta.totdisp = data.length ;   this.dataSource = new MyDataSource(data ,  this.sort , this.paginator) ;
          
            Observable.fromEvent(this.filter.nativeElement, 'keyup')
            .debounceTime(150)
            .distinctUntilChanged()
            .subscribe(() => {
              if (!this.dataSource) { return; }
              this.dataSource.filter = this.filter.nativeElement.value;
            });
          
          } ,
    
      (err: HttpErrorResponse)  => { 
        if (err.error instanceof Error) {
          this.showSnackBar("Client-side:" +err.status+":"+err.statusText, false );
        } else {
          this.showSnackBar("Server-side: " +err.status+":"+err.statusText  , false );
        }
  
       },
      () => {
         // console.log("end ok " + this.dataSource   ) ;
        //  console.log("search Id .... " + this.updateForm (10)  );
         // console.log("search Id .... " + Object.keys ( this.searchId(10) )  );
        // this.updateForm (10) 
         


      });

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
     // this.datas,
   //   this.mysort.sortChange,
      this._filterChange,
      this.mypaginator.page
    ];

    return Observable.merge(...displayDataChanges).map((e) => {

  

      const datasorted =this.datas;
      //this.getSortedData(); 

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
