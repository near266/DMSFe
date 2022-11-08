import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimekeepingRoutingModule } from './timekeeping-routing.module';
import { TimekeepingComponent } from './timekeeping.component';


@NgModule({
  declarations: [
    TimekeepingComponent
  ],
  imports: [
    CommonModule,
    TimekeepingRoutingModule
  ]
})
export class TimekeepingModule { }
