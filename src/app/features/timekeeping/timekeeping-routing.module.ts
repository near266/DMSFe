import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimekeepingComponent } from './timekeeping.component';

const routes: Routes = [{ path: '', component: TimekeepingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimekeepingRoutingModule { }
