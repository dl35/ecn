import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { HttpClientModule  } from '@angular/common/http';


import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';


import { QuillModule } from 'ngx-quill';

import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_LOCALE_PROVIDER,
  MAT_DATE_FORMATS
} from '@angular/material';

//import { M   } from '@angular/material';

/*
import { myDateAdapter } from './providers/myDateAdapter';
import { APP_DATE_FORMATS } from './providers/myDateAdapter';


*/
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';

import 'hammerjs';


import { CompetitionsComponent } from './competitions/competitions.component';
import { DialogConfirm } from './competitions/competitions.component';

import { EngagementsComponent } from './engagements/engagements.component';
import { MailtoComponent } from './mailto/mailto.component';
import { LicenciesComponent } from './licencies/licencies.component';

import { DialogengagementComponent } from './engagements/dialog/dialogengagement.component';


import { CompetitionsService } from './services/competitions.service';
import { LoginService } from './services/login.service';
import { LicenciesService } from './services/licencies.service';
import { EngagementsService } from './services/engagements.service';
import {MailtoService} from './services/mailto.service';


import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guard/auth.guards';
import { MainComponent } from './main/main.component';
import { MytestComponent } from './mytest/mytest.component';




/*
export const routes: Routes = [
  { path: 'login', component: LoginComponent },


  { path: 'licencies', component: LicenciesComponent },
  { path: 'engagements', component: EngagementsComponent },
  { path: 'competitions', component: CompetitionsComponent },
  { path: 'mailto', component: MailtoComponent },
  { path: '**', redirectTo: '/login',    pathMatch: 'full'  }
  
];
*/

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
//  { path: '', component: LoginComponent },
{ path: '',   component: MainComponent, canActivate: [AuthGuard] ,canActivateChild :[AuthGuard] ,children:
[

  { path: 'licencies', component: LicenciesComponent },
  { path: 'engagements', component: EngagementsComponent },
  { path: 'competitions', component: CompetitionsComponent },
  { path: 'mailto', component: MailtoComponent  },
  { path: 'mytest', component: MytestComponent  },
]},

  { path: '**',   component: LoginComponent   }
  
];






@NgModule({
  declarations: [
    AppComponent,
    CompetitionsComponent,
    DialogConfirm,
    EngagementsComponent,
    MailtoComponent,
    LicenciesComponent,
    LoginComponent,
    DialogengagementComponent,
    MainComponent,
    MytestComponent,
    
  ],
  entryComponents:[
    DialogengagementComponent,
    DialogConfirm,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    QuillModule ,
    RouterModule.forRoot(routes)
  ],
  providers: [
    //{provide: MD_DATE_FORMATS, useValue : APP_DATE_FORMATS },
    //{provide: LOCALE_ID, useValue : 'fr-FR' },
  //  {provide: DateAdapter, useClass: myDateAdapter} ,

  {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
    CompetitionsService ,MailtoService, LoginService, LicenciesService, EngagementsService ,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {



 }
