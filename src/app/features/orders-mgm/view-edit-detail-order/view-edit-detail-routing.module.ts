import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { DetailOrderComponent } from './detail-order/detail-order.component';
import { ViewEditDetailOrderComponent } from './view-edit-detail-order.component';

const routes: Routes = [
    {
        path: '',
        component: ViewEditDetailOrderComponent,
        children: [
            {
                path: 'viewEdit',
                component: DetailOrderComponent,
            },
            {
                path: 'customer',
                component: CustomerComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ViewEditDetailRoutingModule {}
