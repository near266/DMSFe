import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePurchaseOrderComponent } from './create-purchase-order/create-purchase-order.component';
import { OrdersMgmComponent } from './orders-mgm.component';

const routes: Routes = [
    {
        path: '',
        component: OrdersMgmComponent,
    },
    {
        path: 'createPerchaseOrder',
        component: CreatePurchaseOrderComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OrdersMgmRoutingModule {}
