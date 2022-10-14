import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailReturnComponent } from '../detail-return/detail-return.component';
import { ViewEditDetailReturnComponent } from './view-edit-detail-return.component';

const routes: Routes = [
  {
    path: '',
    component: ViewEditDetailReturnComponent,
    children: [
        {
            path: '',
            redirectTo: 'view_edit/:id',
            pathMatch: 'full',
        },
        {
            path: 'view_edit/:id',
            component: DetailReturnComponent,
        },
    ],
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewEditDetailReturnRoutingModule { }
