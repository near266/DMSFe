import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitReportComponent } from './visit-report.component';
import { VisitReportRoutes } from './visit-report.routing';
import { ColSpanTemplateTableComponent } from './common-template/col-span-template-table/col-span-template-table.component';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { PaginationComponent } from './component/pagination/pagination.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { TableComponent } from './component/table/table.component';
import { DetailEmployeeComponent } from './component/detail-employee/detail-employee.component';

@NgModule({
    imports: [CommonModule, VisitReportRoutes, SharedModule],
    declarations: [
        VisitReportComponent,
        ColSpanTemplateTableComponent,
        SidebarComponent,
        PaginationComponent,
        TableComponent,
        DetailEmployeeComponent,
    ],
})
export class VisitReportModule {}
