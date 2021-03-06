import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { LicenciesService , MessageResponse   } from '../services/licencies.service' ;
import { MatSort, MatSnackBar, MatPaginator } from '@angular/material';
import { FormBuilder, FormControl , FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { trigger, animate, style, transition, state } from '@angular/animations';


@Component({
  selector: 'app-licencies',
  templateUrl: './licencies.component.html',
  styleUrls: ['./licencies.component.css'],
  animations: [
    trigger('state', [
      transition('false => true', [
        style({opacity : '0'}),
              animate('0.9s ease-in-out', style(
                { opacity: '1'  }
              ))
      ]),
      transition('true => false', [
        style({opacity : '1'}),
        animate('0.9s ease-in-out', style({ opacity: '0'}))
      ])
      ]
    )
  ],
})
/*
     state('true' , style({ opacity: 1 })),
      state('false', style({ opacity: 0 })),
    transition('* => *', animate('0.5s ease-in-out'))

transition('hidden => visible', [
  style({opacity : '0'}),
        animate('1s ease-in-out', style(
          { opacity: '1', background: 'red' }
        ))
]),
transition('visible => hidden', [
  style({opacity : '1'}),
  animate('1s ease-in-out', style({ opacity: '0'}))
])

*/
export class LicenciesComponent implements OnInit {

  public dataForm: FormGroup ;
  public dataSource: MyDataSource ;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  state: boolean;

  invalid = {
    mail: 'Adresse email invalide' ,
    tel: 'Téléphone email invalide'

  } ;


  meta= {
    displayForm : false ,
    rang: ['-' , '1', '2', '3', '4' ],
    banque: ['CA', 'CMB'],
    officiel: ['Non', 'A', 'B', 'C'],
    sexe: ['F', 'H'] ,
    type: [{'name': 'Ren' , 'value': 'R' } , {'name': 'Nou' , 'value': 'N' } ] ,
    niveau: [{'name': 'Dep' , 'value': 'Dep' } , {'name': 'Reg' , 'value': 'Reg' } , {'name': 'Nat' , 'value': 'Nat' }] ,
    // tslint:disable-next-line:max-line-length
    categorie: [{'name': '-' , 'value': '-' } , {'name': 'Avenir' , 'value': 'AV' } , {'name': 'Jeune' , 'value': 'JE' } , {'name': 'Junior' , 'value': 'JU' }, {'name': 'Senior' , 'value': 'SE' }, {'name': 'Master' , 'value': 'MA' }] ,
    total : 0,
    totdisp : 0
  };


  maxDate: Date;
  minDate: Date;
  startDate: Date;

  myfilter= {sexe: '', categorie: '', type: ''};




  constructor( private formBuilder: FormBuilder, private licservice: LicenciesService , private snackBar: MatSnackBar ) {

        this.maxDate = new Date();
        const dmax = ( new Date().getFullYear() )  - 5 ;
        this.maxDate.setFullYear ( dmax ) ;
        this.minDate = new Date() ;
        const dmin = ( new Date().getFullYear() )  - 90 ;
        this.minDate.setFullYear ( dmin ) ;
       }


       saveForm() {

        this.meta.displayForm = false;
        localStorage.setItem('key' , JSON.stringify ( this.dataForm.value )  );


          this.licservice.store( this.dataForm.value ).subscribe(

            ( data: MessageResponse )  =>  { console.log( JSON.stringify(data)  ) ;  this.showSnackBar( data.message  , data.success );  },
            (err: HttpErrorResponse)  => {
              if (err.error instanceof Error) {
                this.showSnackBar('Client-side error occured.', false );
              } else {
                this.showSnackBar('Server-side error occured.' + err.statusText  , false );
              }

             },
          () => {


          });




        }


       initForm() {

            this.dataForm = this.formBuilder.group({
              id: ['-1' ],
              nom: [ null , [Validators.required] ],
              prenom:  [ null , [Validators.required] ],
              date:  [ new Date() , [Validators.required] ],
              sexe:  [ null , [Validators.required] ],

              categorie:  [ null , [Validators.required] ],
              rang:  [ null  , [Validators.required] ],
              officiel:  [ null   ],
              entr:  [ null  ],



              adresse:  [ null , [Validators.required] ],
              code_postal:  [ null , [Validators.required] ],
              ville:  [ null  , [Validators.required] ],

              telephone1:  [ null , [Validators.required] ],
              telephone2:  [ null ],
              telephone3:  [ null ],

              // tslint:disable-next-line:max-line-length
              email1:  [ null , [Validators.required , Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$') ] ],
              email2:  [ null  , [Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$') ]],
              // tslint:disable-next-line:max-line-length
              email3:  [ null  , [Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$') ]],
              licence:  [ null  ],

              commentaires:  [ null  ],

              carte:  [ '0' ],

              auto_parentale:  [ false  ] ,
              cert_medical:  [ false  ],
              fiche_medicale:  [ false  ],
              photo:  [ false  ],
              paye:  [ false  ],
              reglement:  [ false  ],
              tarif:  [ null  ],
              cotisation: new FormControl({value: '', disabled: true }) ,
              especes:  [ 0.0  ],
              cheque1:  [ null  ],
              cheque2:  [ null  ],
              cheque3:  [ null ],
              ch_sport:  [null],
              coup_sport:  [null],
              num_cheque1:  [null],
              num_cheque2:  [null],
              num_cheque3:  [null],
              num_sport:  [null],
              num_coupsport:  [null],
              nbre_chvac10:  [null],
              nbre_chvac20:  [null],
              banque:  [null],
              type:  [ 'N' , [Validators.required]  ],
              valide:  [ false  ],








            });

       //     this.customValidator();
          }




    customValidator() {

      this.dataForm.get('telephone2').valueChanges.subscribe(

            (value: any) => {
            console.log( value.length  ) ;

                if ( value.length > 0 ) {
                    this.dataForm.get('telephone2').setValidators([Validators.required]);
                }
                this.dataForm.get('telephone2').updateValueAndValidity();




            } ) ;
        this.dataForm.get('telephone3').valueChanges.subscribe(

              (value: any) => {
              console.log( value.length  ) ;

                  if ( value.length > 0 ) {
                      this.dataForm.get('telephone3').setValidators([Validators.required]);
                  }
                  this.dataForm.get('telephone3').updateValueAndValidity();
              } ) ;
        this.dataForm.get('email2').valueChanges.subscribe(

              (value: any) => {
              console.log( value.length  ) ;

                  if ( value.length > 0 ) {
                      this.dataForm.get('email2').setValidators([Validators.required]);
                  }
                  this.dataForm.get('email2').updateValueAndValidity();
              } ) ;
        this.dataForm.get('email3').valueChanges.subscribe(

              (value: any) => {
              console.log( value.length  ) ;

                  if ( value.length > 0 ) {
                      this.dataForm.get('email3').setValidators([Validators.required]);
                  }
                  this.dataForm.get('email3').updateValueAndValidity();
              } ) ;
    }




  ngOnInit() {


          this.initForm();

          Observable.fromEvent(this.filter.nativeElement, 'keyup')
          .debounceTime(150)
          .distinctUntilChanged()
          .subscribe(() => {
            if (!this.dataSource) { return; }
            this.dataSource.filter = this.filter.nativeElement.value;
          });


          this.licservice.list().subscribe(
          // tslint:disable-next-line:max-line-length
          ( data: any[] ) => { this.meta.total = data.length ; this.meta.totdisp = data.length ;   this.dataSource = new MyDataSource(this.sort , this.paginator) ;
            this.dataSource.mydatafilter = data ;

         /*   Observable.of( this.myfilter )
             .debounceTime(150)
            .distinctUntilChanged()
            .subscribe(() => {
              if (!this.dataSource) { return; }
              this.dataSource.myfilter = this.myfilter;
            });*/



          },
          (err: HttpErrorResponse)  => {
            if (err.error instanceof Error) {
              this.showSnackBar('Client-side:' + err.status + ':' + err.statusText, false );
            } else {
              this.showSnackBar('Server-side: ' + err.status + ':' + err.statusText  , false );
            }

           },
          () => {
              console.log('end ok ' + this.dataSource   ) ;
            //  console.log("search Id .... " + this.updateForm (10)  );
             // console.log("search Id .... " + Object.keys ( this.searchId(10) )  );
            // this.updateForm (10)



          });

      }


      editForm( id ) {


          this.meta.displayForm = true;
          if ( id !== null   ) {
              const response = this.searchId( id ) ;
              this.dataForm.setValue(response );  /// , { onlySelf: true });
              this.startDate = new Date( this.dataForm.get('date').value  );
          } else {
            this.dataForm.reset();
            this.startDate = new Date();
            const dstart = ( new Date().getFullYear() )  - 10 ;
            this.startDate.setFullYear ( dstart ) ;
            this.dataForm.get('type').setValue('N');
            this.dataForm.get('id').setValue('-1');



          }


      }
        searchId( id )  {
          let item: any;
          const d =   this.dataSource.mydatafilter;
          for (let i = 0; i < d.length ; i++) {
            item = d[i];
            if ( item.id === id ) {
           /*   ( item.verif === '0' ) ? item.verif = false : item.verif = true ;
              ( item.choixnages === '0' ) ? item.choixnages = false : item.choixnages = true ;
              item.debut = new Date( item.debut );
              item.fin = new Date( item.fin );*/
              item.date = new Date( item.date );

              break;
            }

          }

          return item ;

    }

      cancelForm() {

        this.meta.displayForm = false;




      }



      toFilter( $event ) {

console.log( this.myfilter );
if (!this.dataSource) { return; }
this.dataSource.myfilter = this.myfilter;
      }



        refreshData() {

          this.licservice.list().subscribe(
            ( data: any[] ) => { this.meta.total = data.length ; this.meta.totdisp = data.length ;   this.dataSource.mydatafilter = data;



            /*  Observable.fromEvent(this.filter.nativeElement, 'keyup')
              .debounceTime(150)
              .distinctUntilChanged()
              .subscribe(() => {
                if (!this.dataSource) { return; }
                this.dataSource.filter = this.filter.nativeElement.value;
              });*/

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





      showSnackBar( message , info) {
          // tslint:disable-next-line:no-shadowed-variable
          let style = 'snack-success';
        if ( !info ) {
           style = 'snack-error';
        }

        this.snackBar.open( message, '', {
          duration: 2000,
          extraClasses: [ style ]

        });

        if ( info ) {
            this.refreshData();
          }





      }





}



export class MyDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  _myfilterChange = new BehaviorSubject('');
  get myfilter(): any { return this._myfilterChange.value; }
  set myfilter(myfilter: any) { this._myfilterChange.next(myfilter); }

  _mydataChange = new BehaviorSubject([]);
  get mydatafilter(): any[]   { return this._mydataChange.value; }
  set mydatafilter(d: any[] ) { this._mydataChange.next(d); }


  constructor( /*public datas: any[] ,*/  private mysort: MatSort , private mypaginator:  MatPaginator) {
    super();

    this.mypaginator._intl.itemsPerPageLabel = 'items / page';

  }


  connect(): Observable<Element[]> {


    const displayDataChanges = [
      this._mydataChange,
      this.mysort.sortChange,
      this._filterChange,
      this._myfilterChange,
      this.mypaginator.page
    ];

    return Observable.merge(...displayDataChanges).map((e) => {

  console.log('update...');

      const datasorted = this.getSortedData();


      const datafilter  = datasorted.slice().filter((item: any) => {
        const searchStr = (item.nom + ' ' + item.prenom + ' ' + item.ville ).toLowerCase();
        // this.mypaginator.pageIndex =0 ;

        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });


      const datafilter2  = datafilter.slice().filter((item: any) => {
      let flag  = false;


      if ( ! this.myfilter ) {
          return true; }

      if ( this.myfilter.sexe === ''  ) {flag = true;
       } else { if ( item.sexe === this.myfilter.sexe  ) {
                  flag = true;
                } else {flag = false; }
      }

      if ( this.myfilter.categorie === ''  ) {flag = flag && true;
      } else { if (  item.categorie === this.myfilter.categorie.toLowerCase() ) {
                  flag = flag && true;
                } else { flag = false; }
      }

      if ( this.myfilter.type === ''  ) {  flag = flag && true;
       } else { if (  item.type === this.myfilter.type ) {
                  flag = flag && true;
                } else { flag = false; }
      }



          return   flag ;
      });



      this.mypaginator.length = datafilter2.length;

      if (this.mypaginator.pageIndex * this.mypaginator.pageSize >  this.mypaginator.length ) {
         this.mypaginator.pageIndex = 0; }

      const startIndex = this.mypaginator.pageIndex * this.mypaginator.pageSize;
      return datafilter2.splice(startIndex, this.mypaginator.pageSize);
    });

  }


  getSortedData(): Element[] {
    if (!this.mysort.active || this.mysort.direction === '') { return this.mydatafilter; }

    const data = this.mydatafilter.slice();
    // const data = this.datas.slice();
    console.log ('sorted...'  );



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

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.mysort.direction === 'asc' ? 1 : -1);
    });
  }



  disconnect() {}
}
