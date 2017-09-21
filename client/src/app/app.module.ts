import { BrowserModule } from '@angular/platform-browser';
import { NgModule  } from '@angular/core';

import { Routes,RouterModule } from '@angular/router';
import { HttpClientModule  } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import {EngagementService} from './services/engagement.service';

import {SharedService} from './services/shared.service';

import 'hammerjs';
import { AdhesionComponent } from './adhesion/adhesion.component';
import { CompetitionsComponent } from './competitions/competitions.component';

import { FlexLayoutModule } from '@angular/flex-layout';

export const routes: Routes = [
  { path: 'adhesion', component: AdhesionComponent },
  { path: 'adhesion/:id', component: AdhesionComponent },
  { path: 'competitions/:id', component: CompetitionsComponent },
  { path: 'competitions', component: CompetitionsComponent },
  { path: '**', redirectTo: '/',    pathMatch: 'full'  }
  
];


@NgModule({
  declarations: [
    AppComponent,
    AdhesionComponent,
    CompetitionsComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [EngagementService,SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
