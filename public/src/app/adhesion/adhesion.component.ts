import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse  } from '@angular/common/http';
import { FormBuilder, FormControl , FormGroup, Validators } from '@angular/forms';
import { AdhesionService , MessageResponse   } from '../services/adhesion.service' ;

@Component({
  selector: 'app-adhesion',
  templateUrl: './adhesion.component.html',
  styleUrls: ['./adhesion.component.css']
})
export class AdhesionComponent implements OnInit {

  private sub: any;
  public dataForm: FormGroup ;
  public meta = {
    'showform': true,
    'message': '',
    'code': null,
    'sexe': [{'name': 'Homme' , 'value': 'H'  } , {'name': 'Dame' , 'value': 'F'  } ]
  };
  constructor( private route: ActivatedRoute , private formBuilder: FormBuilder, private adhservice: AdhesionService ) {


  }

  ngOnInit() {
    this.createForm();
    this.dataForm.reset();
    this.sub = this.route.params.subscribe(params => {

                if ( params['code'] )  {

                this.meta.code = params['code'];
                this.adhservice.get(this.meta.code).subscribe(
                  ( data: any )  => { this.dataForm.setValue(data) ; },
                  ( err: HttpErrorResponse)  => { },
                  ( )  => { }

                );

              }
      });


  }


  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

reload() {
  window.location.reload();

}


  createForm() {

    this.dataForm = this.formBuilder.group({
      code: [ null ],
      nom: [ null , [Validators.required] ],
      prenom:  [ null , [Validators.required] ],
      date:  [new Date() , [Validators.required] ],
      sexe:  [ null , [Validators.required] ],
      adresse:  [ null , [Validators.required] ],
      code_postal:  [ null , [Validators.required , Validators.minLength(5) , Validators.maxLength(5) ] ],
      ville:  [ null  , [Validators.required] ],
      email1:  [ null , [Validators.required, Validators.email] ],
      email2:  [ null ],
      email3:  [ null ],
      telephone1:  [ null , [Validators.required, Validators.pattern('^[0-9]{10}$') ] ],
      telephone2:  [ null ],
      telephone3:  [ null ]
    });
   // this.customValidator();
  }

  getErrorMessage() {
  /*  return this.dataForm.get('nom').hasError('required') ? 'You must enter a value' :
    this.dataForm.get('nom').hasError('email') ? 'Not a valid email' : '' ;
*/
      return 'Vous devez saisir un nom' ;

  }

  getErrorTel () {
      return this.dataForm.get('telephone1').hasError('required') ? 'You must enter a telephone' :
      this.dataForm.get('telephone1').hasError('pattern') ? 'numéro de télephone invalide' : '' ;

    }



  customValidator() {

    this.dataForm.get('email2').valueChanges.subscribe(

          (value: any) => {
          console.log( value.length  ) ;

              if ( value.length > 0 ) {
                  this.dataForm.get('email2').setValidators([Validators.email]);
              } else {
                this.dataForm.get('email2').setValidators([null]);
              }

              this.dataForm.get('email2').updateValueAndValidity();




          } ) ;
        }

  public saveForm() {


    const obj = this.dataForm.value ;

console.log( JSON.stringify( obj ) );

    this.adhservice.store( obj ).subscribe (
      ( data: MessageResponse )  => {console.log( data.message );  this.meta.message = data.message ; this.meta.showform = false; },
      ( err: HttpErrorResponse)  => { },
      ( )  => { }

    );

  }










}
