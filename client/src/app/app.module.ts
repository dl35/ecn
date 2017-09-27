import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { HttpClientModule  } from '@angular/common/http';


import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MaterialModule } from '@angular/material';
import { MdNativeDateModule ,  MD_DATE_FORMATS  } from '@angular/material';

import { DateAdapter   } from '@angular/material';
import { myDateAdapter } from './providers/myDateAdapter';
import { APP_DATE_FORMATS } from './providers/myDateAdapter';

import { CdkTableModule } from '@angular/cdk/table';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';

import 'hammerjs';


import { CompetitionsComponent } from './competitions/competitions.component';
import { EngagementsComponent } from './engagements/engagements.component';
import { MailtoComponent } from './mailto/mailto.component';
import { LicenciesComponent } from './licencies/licencies.component';


import { CompetitionsService } from './services/competitions.service';
import { LoginService } from './services/login.service';
import { LicenciesService } from './services/licencies.service';


import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guard/auth.guards';
import { MainComponent } from './main/main.component';


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
]},

  { path: '**',   component: LoginComponent   }
  
];






@NgModule({
  declarations: [
    AppComponent,
    CompetitionsComponent,
    EngagementsComponent,
    MailtoComponent,
    LicenciesComponent,
    LoginComponent,
    MainComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    MdNativeDateModule,
    CdkTableModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    {provide: MD_DATE_FORMATS, useValue : APP_DATE_FORMATS },
    //{provide: LOCALE_ID, useValue : 'fr-FR' },
    {provide: DateAdapter, useClass: myDateAdapter} ,
    CompetitionsService ,LoginService, LicenciesService ,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {



 }
