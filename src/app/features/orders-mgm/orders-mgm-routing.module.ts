import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePurchaseOrderComponent } from './create-purchase-order/create-purchase-order.component';
import { OrdersMgmComponent } from './orders-mgm.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ViewEditDetailOrderComponent } from './view-edit-detail-order/view-edit-detail-order.component';

const routes: Routes = [
    {
        path: '',
        component: OrdersMgmComponent,
    },
    {
        path: 'createPerchaseOrder',
        component: CreatePurchaseOrderComponent,
    },
    {
        path: 'products',
        component: ProductListComponent,
    },
    {
        path: 'detailOrder',
        loadChildren: () =>
            import('./view-edit-detail-order/view-edit-detail-order.module').then((m) => m.ViewEditDetailOrderModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OrdersMgmRoutingModule { }
