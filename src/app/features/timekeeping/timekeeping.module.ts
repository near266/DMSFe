import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimekeepingRoutingModule } from './timekeeping-routing.module';
import { TimekeepingComponent } from './timekeeping.component';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { ReportTimekeepingComponent } from './report-timekeeping/report-timekeeping.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { PaginationComponent } from './component/pagination/pagination.component';


@NgModule({
  declarations: [
    TimekeepingComponent,
    ReportTimekeepingComponent,
    TimesheetComponent,
    PaginationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TimekeepingRoutingModule
  ]
})
export class TimekeepingModule { }
