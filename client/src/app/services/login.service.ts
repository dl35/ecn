import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



export class Profile {
  competitions:boolean;
  licencies:boolean;
  engagments:boolean;
  manage:boolean
constructor( c:boolean   )
{
  this.competitions =c ;

}


}



@Injectable()
export class LoginService {

  
   public profile :Profile ;

  constructor(private http: HttpClient) {  

  }


public getProfile() {
return this.profile;

}

public setTest( profile :Profile  ) {
  this.profile= profile ;

}

    signup( value :any ) {

     this.profile = new Profile(false);

   return this.http.post("/api/private/signup" , value) ;
    }

    signout() {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("profile");
    }

    

   getRole() {

        if(  ! this.checkCredentials()  )   return false;
        else {
          var u= JSON.parse( sessionStorage.getItem( "token" ) ) ;
              return u.role;
        }

    }


   checkCredentials(){
    if (sessionStorage.getItem("token") === null){
      return false;
    }
    else return true;

  }

}
