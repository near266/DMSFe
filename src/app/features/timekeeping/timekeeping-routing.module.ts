import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportTimekeepingComponent } from './component/report-timekeeping/report-timekeeping.component';
import { TimekeepingComponent } from './timekeeping.component';
import { TimesheetComponent } from './component/timesheet/timesheet.component';

const routes: Routes = [
  {
    path: '',
    component: TimekeepingComponent,
    children: [
      {
        path: 'timekeeping',
        component: ReportTimekeepingComponent
      },
      {
        path: 'timesheet',
        component: TimesheetComponent
      },
      {
        path: '',
        redirectTo: 'timekeeping',
        component: ReportTimekeepingComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimekeepingRoutingModule { }
