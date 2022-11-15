import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderReportRoutingModule } from './order-report-routing.module';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { OrderReportTableComponent } from './components/purchase-report/order-report-table/order-report-table.component';
import { OrderReportComponent } from './order-report.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { TemplateTableComponent } from './common-template/template-table/template-table.component';
import { TemplatePaginationComponent } from './common-template/template-pagination/template-pagination.component';
import { SaleReceiptReportTableComponent } from './components/sale-receipt-report/sale-receipt-report-table/sale-receipt-report-table.component';
import { PurchaseReportComponent } from './components/purchase-report/purchase-report.component';
import { SaleReceiptReportComponent } from './components/sale-receipt-report/sale-receipt-report.component';
import { TemplateSidebarComponent } from './common-template/template-sidebar/template-sidebar.component';

@NgModule({
    declarations: [
        OrderReportTableComponent,
        OrderReportComponent,
        SidebarComponent,
        PaginationComponent,
        TemplateTableComponent,
        TemplatePaginationComponent,
        SaleReceiptReportTableComponent,
        PurchaseReportComponent,
        SaleReceiptReportComponent,
        TemplateSidebarComponent,
    ],
    imports: [CommonModule, OrderReportRoutingModule, SharedModule],
})
export class OrderReportModule {}
