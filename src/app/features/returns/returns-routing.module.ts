import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatReturnComponent } from './components/creat-return/creat-return.component';
import { ReturnsComponent } from './returns.component';

const routes: Routes = [
  { path: '', component: ReturnsComponent },

  {
    path: 'create_return_order',
    component: CreatReturnComponent,
  },
  {
    path: 'detail',
    loadChildren: () => import("./components/view-edit-detail-return/view-edit-detail-return.module").then(m=>m.ViewEditDetailReturnModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReturnsRoutingModule { }
