import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AdhesionComponent } from './adhesion/adhesion.component';
import { EngagementComponent } from './engagement/engagement.component';
import { CompetitionComponent } from './competition/competition.component';
import { RecordsComponent } from './records/records.component';
import { StatsComponent } from './stats/stats.component';
import { PiscinesComponent } from './piscines/piscines.component';
import { CotationComponent } from './cotation/cotation.component';
import { Top10Component } from './top10/top10.component';


@NgModule({
  declarations: [
    AppComponent,
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
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
