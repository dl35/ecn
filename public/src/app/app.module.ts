import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule  } from '@angular/common/http';
import { MaterialModule } from './material.module';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';



import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { AdhesionComponent } from './adhesion/adhesion.component';
import { EngagementComponent } from './engagement/engagement.component';
import { CompetitionComponent } from './competition/competition.component';
import { RecordsComponent } from './records/records.component';
import { StatsComponent } from './stats/stats.component';
import { PiscinesComponent } from './piscines/piscines.component';
import { CotationComponent } from './cotation/cotation.component';
import { Top10Component } from './top10/top10.component';
import 'hammerjs';


export const routes: Routes = [
  { path: 'adhesion', component: AdhesionComponent },
  { path: 'adhesion/:id', component: AdhesionComponent },
  { path: 'engagement/:idcompet/:idlicencie', component: EngagementComponent },

{ path: '',   component: MainComponent,  children:
[
  { path: 'competition', component: CompetitionComponent },
  { path: 'cotation', component: CotationComponent },
  { path: 'piscines', component: PiscinesComponent },
  { path: 'top10', component: Top10Component  },
  { path: 'stats', component: StatsComponent },
  { path: 'records', component: RecordsComponent },
]},

  { path: '**',   component: MainComponent   }

];


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    AdhesionComponent,
    EngagementComponent,
    CompetitionComponent,
    RecordsComponent,
    StatsComponent,
    PiscinesComponent,
    CotationComponent,
    Top10Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
