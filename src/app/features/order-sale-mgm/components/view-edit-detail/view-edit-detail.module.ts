import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Routes } from '@angular/router';
import { ViewEditDetailComponent } from './view-edit-detail.component';
import { DetailComponent } from '../detail/detail.component';
import { CustomerComponent } from '../customer/customer.component';
import { SharedModule } from 'src/app/core/shared/shared.module';

const routes: Routes = [
    {
        path: '',
        component: ViewEditDetailComponent,
        children: [
            {
                path: '',
                redirectTo: 'viewEdit',
                pathMatch: 'full',
            },
            {
                path: 'viewEdit',
                component: DetailComponent,
            },
            {
                path: 'customer',
                component: CustomerComponent,
            },
        ],
    },
];

@NgModule({
    declarations: [],
    imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class ViewEditDetailModule {}
