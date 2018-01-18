import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl , FormGroup, Validators } from '@angular/forms';
import {LoginService } from '../services/login.service' ;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public dataForm: FormGroup ;
  public meta= {error: false , message : 'Erreur Authentification !' };
  constructor( private formBuilder: FormBuilder, private loginService: LoginService  , private router: Router  ) {
       }

ngOnInit() {
        this.doSignOut();
        this.initForm();
      }

initForm() {
            this.dataForm = this.formBuilder.group({
              // tslint:disable-next-line:max-line-length
              user: ['test.test@test.fr', [Validators.required , Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$') ] ]  ,
              pwd: ['test', [Validators.required,  Validators.minLength(4)] ]
                                                });
          }


doSignOut() {
  this.loginService.signout();
}


doSignUp() {

this.loginService.signup( this.dataForm.value  ).subscribe(
    // tslint:disable-next-line:max-line-length
    (data)  =>   { sessionStorage.setItem('token' , data['token'] )  ;  sessionStorage.setItem('profile' , data['profile'] )  ;  this.router.navigate(['/']) ;  } ,
    (error) => {
      this.meta.error = true ;
    setTimeout (() => {
      this.meta.error = false ;
    }, 2000) ;

     } ,
    () => {}


 ) ;



}


}
