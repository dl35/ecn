import { Injectable } from '@angular/core';
import { Router, CanActivate , CanActivateChild ,ActivatedRouteSnapshot , RouterStateSnapshot } from '@angular/router';
import {LoginService }  from '../services/login.service' ;


@Injectable()
export class AuthGuard implements CanActivate , CanActivateChild {

    constructor(private router: Router ,private loginservice: LoginService ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot ) {


       if (sessionStorage.getItem('token') !== null && sessionStorage.getItem('profile') !== null ) {
            return true;
        }

        this.router.navigate(['login']);
        return false;
    }


    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

           /* if( state.url == "/competitions"  )
            {

            }*/

  



        return this.canActivate(route,state);
    
      } 

}
