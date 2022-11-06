import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrdersMgmComponent } from './orders-mgm.component';
import { DispatchsRoutingModule } from '../dispatchs/dispatchs-routing.module';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { OrdersMgmRoutingModule } from './orders-mgm-routing.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CreatePurchaseOrderComponent } from './components/create-purchase-order/create-purchase-order.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CustomerComponent } from './components/customer/customer.component';
import { PanagationComponent } from './components/panagation/panagation.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ViewEditDetailOrderComponent } from './components/view-edit-detail-order/view-edit-detail-order.component';
import { ConfirmRejectComponent } from './components/confirm-reject/confirm-reject.component';
import { GenOrderSaleComponent } from './components/gen-order-sale/gen-order-sale.component';
import { ProductPaginationComponent } from './components/product-pagination/product-pagination.component';
import { PromotionTableComponent } from './components/create-purchase-order/promotion-table/promotion-table.component';
import { ProductTableComponent } from './components/create-purchase-order/product-table/product-table.component';
import { DetailProductTableComponent } from './components/detail-order/detail-product-table/detail-product-table.component';
import { DetailOrderComponent } from './components/detail-order/detail-order.component';
import { GenProductTableComponent } from './components/gen-order-sale/gen-product-table/gen-product-table.component';
import { GenPromotionTableComponent } from './components/gen-order-sale/gen-promotion-table/gen-promotion-table.component';

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
    declarations: [
        SidebarComponent,
        OrdersMgmComponent,
        CreatePurchaseOrderComponent,
        ProductListComponent,
        ViewEditDetailOrderComponent,
        CustomerComponent,
        PanagationComponent,
        ConfirmRejectComponent,
        GenOrderSaleComponent,
        ProductPaginationComponent,
        PromotionTableComponent,
        ProductTableComponent,
        DetailProductTableComponent,
        DetailOrderComponent,
        GenProductTableComponent,
        GenPromotionTableComponent
    ],
    imports: [CommonModule, SharedModule, OrdersMgmRoutingModule, RouterModule, NgxPaginationModule],
})
export class OrdersMgmModule {}
