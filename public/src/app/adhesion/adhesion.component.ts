import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl , FormGroup, Validators } from '@angular/forms';
import { AdhesionService , MessageResponse   } from '../services/adhesion.service' ;

@Component({
  selector: 'app-adhesion',
  templateUrl: './adhesion.component.html',
  styleUrls: ['./adhesion.component.css']
})
export class AdhesionComponent implements OnInit {


  public dataForm: FormGroup ;
  public meta = {
    'sexe': [{'name': 'Homme' , 'value': 'H'  } , {'name': 'Dame' , 'value': 'F'  } ]
  };
  constructor( private formBuilder: FormBuilder, private adhservice: AdhesionService ) { }

  ngOnInit( ) {

    this.createForm();


  }
  createForm() {

    this.dataForm = this.formBuilder.group({
      id: [ null ],
      nom: [ null , [Validators.required] ],
      prenom:  [ null , [Validators.required] ],
      date:  [ null, [Validators.required] ],
      sexe:  [ null , [Validators.required] ],
      adresse:  [ null , [Validators.required] ],
      codepostal:  [ null , [Validators.required , Validators.minLength(5) , Validators.maxLength(5) ] ],
      ville:  [ null  , [Validators.required] ],
      email1:  [ null , [Validators.required, Validators.email] ],
      email2:  [ null ],
      email3:  [ null ],
      telephone1:  [ null , [Validators.required] ],
      telephone2:  [ null ],
      telephone3:  [ null ]
    });
    this.customValidator();
  }

  getErrorMessage() {
  /*  return this.dataForm.get('nom').hasError('required') ? 'You must enter a value' :
    this.dataForm.get('nom').hasError('email') ? 'Not a valid email' : '' ;
*/
      return 'Vous devez saisir un nom' ;

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
    this.adhservice.store( obj ).subscribe (
      ( data: MessageResponse )  => { },
      ( err: HttpErrorResponse)  => { },
      ( )  => { }

    );

  }










}
