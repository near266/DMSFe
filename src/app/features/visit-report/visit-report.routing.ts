import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisitReportComponent } from './visit-report.component';

const routes: Routes = [ 
  {
    path: '',
    component: VisitReportComponent
  }
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class VisitReportRoutes {}