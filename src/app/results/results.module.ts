import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';

import { ResultsRoutingModule } from './results-routing.module';
import { ResultsComponent } from './results.component';


@NgModule({
  declarations: [
    ResultsComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    ResultsRoutingModule
  ]
})
export class ResultsModule { }
