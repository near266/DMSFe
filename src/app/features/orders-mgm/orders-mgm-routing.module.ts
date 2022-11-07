import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePurchaseOrderComponent } from './components/create-purchase-order/create-purchase-order.component';
import { OrdersMgmComponent } from './orders-mgm.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { DetailProductTableComponent } from './components/detail-order/detail-product-table/detail-product-table.component';

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
        path: 'detailOrder',
        loadChildren: () =>
            import('./components/view-edit-detail-order/view-edit-detail-order.module').then(
                (m) => m.ViewEditDetailOrderModule,
            ),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OrdersMgmRoutingModule {}
