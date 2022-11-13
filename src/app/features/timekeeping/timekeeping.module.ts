import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimekeepingRoutingModule } from './timekeeping-routing.module';
import { TimekeepingComponent } from './timekeeping.component';
import { SharedModule } from 'src/app/core/shared/shared.module';

import { PaginationComponent } from './component/pagination/pagination.component';
import { ReportTimekeepingComponent } from './component/report-timekeeping/report-timekeeping.component';
import { TimesheetComponent } from './component/timesheet/timesheet.component';


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
