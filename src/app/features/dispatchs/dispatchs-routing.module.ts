import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatchsComponent } from './dispatchs.component';

const routes: Routes = [{ path: '', component: DispatchsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispatchsRoutingModule { }
