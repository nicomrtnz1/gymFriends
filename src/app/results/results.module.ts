import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';

import { ResultsRoutingModule } from './results-routing.module';
import { ResultsComponent } from './results.component';
import { WeightChartComponent } from './weight-chart/weight-chart.component';
import { ScatterChartComponent } from './scatter-chart/scatter-chart.component';

@NgModule({
  declarations: [
    ResultsComponent,
    WeightChartComponent,
    ScatterChartComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    ResultsRoutingModule
  ]
})
export class ResultsModule { }
