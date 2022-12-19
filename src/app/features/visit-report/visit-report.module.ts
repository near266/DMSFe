import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitReportComponent } from './visit-report.component';
import { VisitReportRoutes } from './visit-report.routing';
import { ColSpanTemplateTableComponent } from './common-template/col-span-template-table/col-span-template-table.component';

@NgModule({
  imports: [
    CommonModule,
    VisitReportRoutes
  ],
  declarations: [VisitReportComponent, ColSpanTemplateTableComponent]
})
export class VisitReportModule { }
