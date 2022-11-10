import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderReportRoutingModule } from './order-report-routing.module';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { OrderReportTableComponent } from './components/order-report-table/order-report-table.component';
import { OrderReportComponent } from './order-report.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { TemplateTableComponent } from './common-template/template-table/template-table.component';
import { TemplatePaginationComponent } from './common-template/template-pagination/template-pagination.component';

@NgModule({
    declarations: [
        OrderReportTableComponent,
        OrderReportComponent,
        SidebarComponent,
        PaginationComponent,
        TemplateTableComponent,
        TemplatePaginationComponent,
    ],
    imports: [CommonModule, OrderReportRoutingModule, SharedModule],
})
export class OrderReportModule {}
