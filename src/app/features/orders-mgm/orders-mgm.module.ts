import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrdersMgmComponent } from './orders-mgm.component';
import { DispatchsRoutingModule } from '../dispatchs/dispatchs-routing.module';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { OrdersMgmRoutingModule } from './orders-mgm-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CreatePurchaseOrderComponent } from './create-purchase-order/create-purchase-order.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ViewEditDetailOrderComponent } from './view-edit-detail-order/view-edit-detail-order.component';
import { CustomerComponent } from './view-edit-detail-order/customer/customer.component';

@NgModule({
    declarations: [
        SidebarComponent,
        OrdersMgmComponent,
        CreatePurchaseOrderComponent,
        ProductListComponent,
        ViewEditDetailOrderComponent,
        CustomerComponent
    ],
    imports: [CommonModule, SharedModule, OrdersMgmRoutingModule, RouterModule],
})
export class OrdersMgmModule { }
