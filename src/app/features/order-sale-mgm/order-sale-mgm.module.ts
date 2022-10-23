import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderSaleMgmComponent } from './order-sale-mgm.component';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CreateOrderSaleComponent } from './components/create-order-sale/create-order-sale.component';
import { ViewEditDetailComponent } from './components/view-edit-detail/view-edit-detail.component';
import { DetailComponent } from './components/detail/detail.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CustomerComponent } from './components/customer/customer.component';
import { ProductsComponent } from './components/products/products.component';
import { GenReturnOrderComponent } from './components/gen-return-order/gen-return-order.component';
import { ProductPromotionTableComponent } from './components/product-promotion-table/product-promotion-table.component';
import { ProductTableComponent } from './components/product-table/product-table.component';

const routes: Routes = [
    {
        path: '',
        component: OrderSaleMgmComponent,
    },
    {
        path: 'create',
        component: CreateOrderSaleComponent,
    },
    {
        path: 'detail',
        loadChildren: () =>
            import('./components/view-edit-detail/view-edit-detail.module').then((m) => m.ViewEditDetailModule),
    },
];

@NgModule({
    declarations: [
        OrderSaleMgmComponent,
        SidebarComponent,
        CreateOrderSaleComponent,
        ViewEditDetailComponent,
        DetailComponent,
        PaginationComponent,
        CustomerComponent,
        ProductsComponent,
        GenReturnOrderComponent,
        ProductPromotionTableComponent,
        ProductTableComponent,
    ],
    imports: [CommonModule, SharedModule, RouterModule.forChild(routes), NgxPaginationModule],
})
export class OrderSaleMgmModule {}
