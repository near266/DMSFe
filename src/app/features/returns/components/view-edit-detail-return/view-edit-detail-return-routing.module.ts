import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailReturnComponent } from './detail-return/detail-return.component';
import { HistoryComponent } from './history/history.component';
import { ViewEditDetailReturnComponent } from './view-edit-detail-return.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'viewEdit/:id',
        pathMatch: 'full',
    },
    {
        path: 'viewEdit/:id',
        component: ViewEditDetailReturnComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ViewEditDetailReturnRoutingModule {}
