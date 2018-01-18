import { Component, OnInit, ViewChild , ElementRef, Inject  } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import {DataSource} from '@angular/cdk/table';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import {CompetitionsService , MessageResponse } from '../services/competitions.service' ;
import { MatSort , MatSnackBar , MatPaginator } from '@angular/material';
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
  public futures = false;
  public verifiees = false;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(public dialog: MatDialog,
    private formBuilder: FormBuilder, private compService: CompetitionsService ,
    private snackBar: MatSnackBar  ) {
   }



  minDate = new Date(2017, 8, 1);
  maxDate = new Date(2018, 7, 31);

  meta= {
     displayForm : false ,
    'bassin': [{'name': '25' , 'value': '25'  } , {'name': '50' , 'value': '50'  }  ] ,
    'type': [{'name': 'Stage' , 'value': 'stage' } , {'name': 'Compétition' , 'value': 'compet'  } ] ,
    'entraineur': [] ,
    total : 0,
    totdisp : 0
  };

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  private createForm() {
    // Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$') ,
    this.dataForm = this.formBuilder.group({
      id: new FormControl(null),
      nom: ['', [Validators.required,  Validators.minLength(5)] ],
      lieu:  ['', [Validators.required, Validators.minLength(4)] ],
      categories: new FormGroup({
        av: new FormControl(false),
        je: new FormControl(false),
        dep: new FormControl(false),
        reg: new FormControl(false),
        nat: new FormControl(false),
        ma: new FormControl(false)
      }, this.catValidator),
      bassin: [ '25' , [Validators.required] ],
      type: [ 'compet' , [ Validators.required ]] ,
      debut: [ null , [Validators.required] ],
      fin: [ null  , [Validators.required] ],
      heure: ['07', [Validators.required] ],
      limite: [ null  , [Validators.required] ],
      choixnages: new FormControl(false),
      max: new FormControl(0),
      entraineur:  [ null, [Validators.required] ],
      lien: new FormControl(null, Validators.pattern('')),
      commentaires: new FormControl(null),
      verif: new FormControl({value: false , disabled: true}),
    },
    {validator: this.allDateValidator  }
  );
  this.setValidator();
  }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private catValidator(gcat: FormGroup ) {

 let res = false;
   Object.keys( gcat.controls).forEach(key => {
     if ( gcat.get(key).value ) {
       res = true; }
   });
   if (res) {
     return null;
    } else {
     return {catError: true};
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private setValidator() {
    this.dataForm.get('type').valueChanges.subscribe(
        (type: string) => {
              if (type === 'compet') {
               this.dataForm.get('max').setValidators(null);
              } else  {
               this.dataForm.get('max').setValidators([Validators.required, Validators.pattern('^[1-9][0-9]*$')]);
              }
               this.dataForm.get('max').updateValueAndValidity();
          }
      );
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private  allDateValidator(input: FormControl ): any {


      if ( input.get('debut').value === null || input.get('fin').value === null  || input.get('limite').value === null  ) {
        return null;
      }

     const start = Date.parse( input.get('debut').value);
     const end = Date.parse( input.get( 'fin' ).value);
     const limite = Date.parse( input.get( 'limite' ).value);

      return  ( start <=  end && limite < start  ) ?  null :  {dateError: true};
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private onDateStart(event: MatDatepickerInputEvent<Date> ) {
  const start = new Date(event.value);
  if ( this.dataForm.get('fin').value === null  ) {
    this.dataForm.get('fin').setValue( start ) ;
  }
  if ( this.dataForm.get('limite').value === null ) {
    const limite = new Date(start);
    limite.setDate( limite.getDate() - 10 );
    this.dataForm.get('limite').setValue( limite ) ;
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private setVerif() {

if ( this.dataForm.get('id').value === null  ) {
      if (this.dataForm.get('type').value === 'stage' ) {
        this.dataForm.get('verif').disable();
        this.dataForm.get('verif').setValue(false);
      } else {
        this.dataForm.get('verif').enable();
        this.dataForm.get('verif').setValue(true);
      }
    }
  }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private cancelForm() {
  this.meta.displayForm = false;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private showSnackBar( message , info) {
  let style = 'snack-success';
  if ( !info ) {
    style = 'snack-error';
  }

  this.snackBar.open( message  , '', {
    duration: 2000,
    extraClasses: [ style ]
  });

}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private onFutures() {
this.dataSource.future = this.futures;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private onVerifiees() {
this.dataSource.verifiees = this.verifiees;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private openDialog( id ): void {

  const dialogRef = this.dialog.open(DialogConfirm, {
    width: '50%',
    data: {'id': id},
    disableClose: true
   });

   dialogRef.beforeClose().subscribe(
     (result) => { console.log(result) ;
               if (result) {
                  this.refreshData();
                      }},
     (err) => {},
     () => {},
   );

 }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private refreshData() {

            this.compService.list().subscribe(
              ( data: any ) => {
                this.meta.total = data.datas.length ;
                this.meta.totdisp = data.datas.length ;
                this.dataSource = new MyDataSource(data.datas ,  this.sort , this.paginator) ;
              },
              (err: HttpErrorResponse)  => {
                if (err.error instanceof Error) {
                  this.showSnackBar('Client-side:' + err.status + ':' + err.statusText, false );
                } else {
                  this.showSnackBar('Server-side: ' + err.status + ':' + err.statusText  , false );
                }

               },
              () => {
              });

          }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private saveForm() {

this.meta.displayForm = false;

console.log( 'save from 1 ' , this.dataForm.value    );
const obj = this.dataForm.value ;
Object.keys(obj).forEach(function (key) {
  if (typeof obj[key] === 'undefined'  ||  obj[key] === null  ) {
     delete obj[key];
   }
 });

   console.log( 'save from' , JSON.stringify( obj )  );
  this.compService.store( obj ).subscribe(

    ( data: MessageResponse )  => {
        this.showSnackBar( data.message  , data.success );
        this.refreshData();
      },
    (err: HttpErrorResponse)  => {
      if (err.error instanceof Error) {
        this.showSnackBar('Client side error occured', false );
      } else {
        this.showSnackBar('Server side error occured: ' + err.statusText  , false );
      }

     },
  () => {}

  );


}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private updateForm( id )  {


  if ( id !== null ) {
    const response = this.searchId( id ) ;

      this.dataForm.setValue(response, { onlySelf: true });

      if ( this.dataForm.get('type').value  === 'compet') {
        this.meta.type =  [ {'name': 'Compétition' , 'value': 'compet'  } ] ;
      } else {
        this.meta.type =  [{'name': 'Stage' , 'value': 'stage' }  ] ;
      }
      this.dataForm.get('verif').enable();

  } else {

    this.dataForm.reset();
    this.dataForm.get('bassin').setValue('25');
    this.dataForm.get('type').setValue('compet');
    this.dataForm.get('heure').setValue('07');
    this.dataForm.get('verif').setValue(false);
    this.dataForm.get('verif').disable();
    this.meta.type =  [{'name': 'Stage' , 'value': 'stage' } , {'name': 'Compétition' , 'value': 'compet'  } ] ;

        }
    this.meta.displayForm = true;
 }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
private searchId( id )  {
      let item: any ;
      const d =   this.dataSource.datas;
      for (let i = 0; i < d.length ; i++) {

        if ( d[i].id === id ) {
          item = Object.assign({}, d[i]);
          delete item.del;
          break;
        }

      }

      return item ;

}
 deleteItem( id ) {
 }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
public ngOnInit() {

      this.createForm();

      this.compService.list().subscribe(
        ( data: any ) => {
           this.meta.entraineur = data.entr;
           this.meta.total = data.datas.length ;
           this.meta.totdisp = data.datas.length ;
           this.dataSource = new MyDataSource(data.datas ,  this.sort , this.paginator) ;

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
          this.showSnackBar('Client-side: ' + err.status + ':' + err.statusText, false );
        } else {
          this.showSnackBar('Server side: ' + err.status + ':' + err.statusText  , false );
        }

       },
      () => {
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


  constructor(public datas: any[] , private mysort: MatSort , private mypaginator:  MatPaginator) {
    super();

    this.mypaginator._intl.itemsPerPageLabel = 'items / page';
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
        let f = true;
        if ( this.future ) {
           f = ( new Date(item.debut) >= new Date() ) ;
        }
        return f;
      });

      const dataverifiees  = datafutures.slice().filter((item: any) => {
        let v = true;
        if ( this.verifiees ) {
           v = (item.verif === true );
        }
        return v;
      });

      const datafilter  = dataverifiees.slice().filter((item: any) => {
        const searchStr = (item.nom + ' ' + item.lieu + ' ' + item.type ).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });
      this.mypaginator.length = datafilter.length;

      if (this.mypaginator.pageIndex * this.mypaginator.pageSize >  this.mypaginator.length ) {
         this.mypaginator.pageIndex = 0;
      }

      const startIndex = this.mypaginator.pageIndex * this.mypaginator.pageSize;
      return datafilter.splice(startIndex, this.mypaginator.pageSize);
    });

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

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.mysort.direction === 'asc' ? 1 : -1);
    });
  }



  disconnect() {}
}


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog.html',
})
// tslint:disable-next-line:component-class-suffix
export class DialogConfirm {

  eprogress= true;
  ehidden= true;
  success= false;
  color= null;
  texte_info= 'Voulez vous supprimer cette compétition?';
  constructor(public dialogRef: MatDialogRef<DialogConfirm>,
              public compService: CompetitionsService,
              @Inject(MAT_DIALOG_DATA) public data: any) {

               }


  private executeDelete() {
      this.ehidden = false;
      this.eprogress = !this.eprogress;
      this.compService.delete(this.data.id).subscribe(
        (data: MessageResponse ) => {
          this.texte_info = data.message;
          if ( data.success ) { this.success = true; this.color = 'green';
           } else { this.color = 'red'; }
                              },
        (err: HttpErrorResponse) => {
         // tslint:disable-next-line:max-line-length
         (err.error instanceof Error) ? this.texte_info = 'Client side error occured' : this.texte_info = 'Server side error occured: ' + err.statusText ;
                },

        () => {
          setTimeout( () => this.eprogress = !this.eprogress  , 1000 );
           }
      );



  }
}
