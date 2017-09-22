import { Component, OnInit, ViewChild  } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {DataSource} from '@angular/cdk/table';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';


import {CompetitionsService , MessageResponse }  from '../services/competitions.service' ;


import { MdSort,MdSnackBar } from '@angular/material';




import { FormBuilder, FormControl , FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.css']
})
export class CompetitionsComponent implements OnInit {

  public dataForm: FormGroup ;
  public dataSource: MyDataSource ;

  @ViewChild(MdSort) sort: MdSort;
  


  constructor( private formBuilder: FormBuilder, private compService: CompetitionsService , private snackBar: MdSnackBar  ) {

   



   }



  minDate = new Date(2017, 8, 1);
  maxDate = new Date(2018, 7, 31);

  meta={
    displayForm : false ,
    "bassin":[{"type":"25" ,"value":"25"  } , {"type":"50" ,"value":"50"  }  ] ,
    "categories":[{"type":"Avenirs" ,"value":"av"  } , {"type":"Poussins" ,"value":"po"  } , {"type":"Benjamins" ,"value":"ben"  } ,{"type":"Minimes" ,"value":"mi"  } , {"type":"Cadets" ,"value":"ca"  }, {"type":"Juniors" ,"value":"ju"  }, {"type":"Seniors" ,"value":"se"  } , {"type":"Masters" ,"value":"ma"  }],
    "type": [{"type":"Stage" ,"value":"stage"  } , {"type":"Compétition" ,"value":"compet"  } ]
  };


  initForm() {

    //Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$') , 

    this.dataForm = this.formBuilder.group({
      id: ['-1', [Validators.required] ],
      nom: ['', [Validators.required,  Validators.minLength(5)] ],
      lieu:  ['', [Validators.required, Validators.minLength(4)] ],
      //categories: [  this.formBuilder.array([new FormControl( 'sf'),new FormControl('ff'),new FormControl('ll')]) , [Validators.required] ],
      //categories:  this.formBuilder.array([new FormControl( {value: 'false', type:'av'  } ),new FormControl( {value: 'false', type:'ben'} ),new FormControl({value: 'false', type:'mi'}  )]) , 
      //categories:  this.formBuilder.array([{value: true, type:'av'  } ,{value: false, type:'po'  } ] )  , 

      categories:  this.formBuilder.group({ap: true, ben:false , mi:true , dep:false , reg :false , nat :false , mast :false }  )  , 
      bassin:  [ "25" , [Validators.required] ],
      type:  ['compet', [Validators.required] ],
      debut:  [ new Date('2017-05-12') , [Validators.required] ],
      fin:  [ new Date()   , [Validators.required] ],
      heure:  ['07:00', [Validators.required] ],
      limite_club:  [ new Date() , [Validators.required] ],
      verif:  [ false , [Validators.required] ],
      choixnages:  [ false , [Validators.required] ],
      
      max:  ['0', [Validators.required] ],
      entraineur:  ['ok', [Validators.required] ] ,

     commentaires:  ['']
    });


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
localStorage.setItem('key' ,JSON.stringify ( this.dataForm.value )  );


  this.compService.store( this.dataForm.value ).subscribe( 
    
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



//this.cities.patchValue(['LA', 'MTV']);

 updateForm( id )  {

 this.meta.displayForm=true;

 // ( this.dataForm == undefined  ) ? this.initForm()  :  this.dataForm.reset(); 
 //this.dataForm.reset(); 
  if( id != -1 )
  {  
      let response= this.searchId( id ) ;
      delete response['limite_affichage'] ;delete response['lien'] ;
      //delete response['choixnages'] ;
      //delete response['limite_club'] ;
      delete response['limite'] ;
      response['commentaires']="";

      this.dataForm.setValue(response, { onlySelf: true });
  }
  else {
    this.dataForm = undefined ;
    this.initForm(); 

  }


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
           item.limite_club = new Date( item.limite_club );
           

          break;
        }  

      }

      return item ;

}



 deleteItem( id ) {


 }






  ngOnInit() {



      this.initForm();

      this.compService.list().subscribe(
      ( data: any[] ) => this.dataSource = new MyDataSource(data ,  this.sort ) ,  
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





}

export class MyDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */

  constructor(public datas: any[] , private mysort: MdSort ) {
    super();
  }


  connect(): Observable<Element[]> {
    //return Observable.of(this.datas);

    const displayDataChanges = [
      this.datas,
      this.mysort.mdSortChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      return this.getSortedData();
    });;

  }


  getSortedData(): Element[] {
    const data = this.datas.slice();
    if (!this.mysort.active || this.mysort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

console.log (this.mysort.active );

      switch (this.mysort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'nom': [propertyA, propertyB] = [a.nom, b.nom]; break;
        case 'lieu': [propertyA, propertyB] = [a.lieu, b.lieu]; break;
        case 'type': [propertyA, propertyB] = [a.type, b.type]; break;
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

