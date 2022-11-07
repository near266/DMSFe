import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimekeepingRoutingModule } from './timekeeping-routing.module';
import { TimekeepingComponent } from './timekeeping.component';
import { SharedModule } from 'src/app/core/shared/shared.module';


@NgModule({
  declarations: [
    TimekeepingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TimekeepingRoutingModule
  ]
})
export class TimekeepingModule { }
