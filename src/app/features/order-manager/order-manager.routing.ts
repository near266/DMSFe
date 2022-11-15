import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreatePurchaseOrderComponent } from '../orders-mgm/components/create-purchase-order/create-purchase-order.component';
import { OrderManagerComponent } from './order-manager.component';
import { CreatePurchaseComponent } from './purchase-mgm/create-purchase/create-purchase.component';
import { DetailPurchaseComponent } from './purchase-mgm/detail-container/detail-purchase/detail-purchase.component';
import { PurchaseMgmComponent } from './purchase-mgm/purchase-mgm.component';

const routes: Routes = [
    {
        path: '',
        component: OrderManagerComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'purchase',
            },
            {
                path: 'purchase',
                loadChildren: () => import('./purchase-mgm/purchase-mgm.module').then((m) => m.PurchaseMgmModule),
            },
            {
                path: 'sale',
                loadChildren: () => import('./sale-mgm/sale-mgm.module').then((m) => m.SaleMgmModule),
            },
        ],
    },
];
@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OrderManagerRoutes {}
