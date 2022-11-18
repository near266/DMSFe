import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { TemplateTableComponent } from './template-table/template-table.component';
import { TemplatePaginationComponent } from './template-pagination/template-pagination.component';
import { TemplateSidebarComponent } from './template-sidebar/template-sidebar.component';
import { TemplateHeaderComponent } from './template-header/template-header.component';
import { TemplateInforOrderComponent } from './template-infor-order/template-infor-order.component';
import { TemplateTableProductComponent } from './template-table-product/template-table-product.component';
import { TemplateFooterOrderComponent } from './template-footer-order/template-footer-order.component';
import { TemplateCustomerComponent } from './template-customer/template-customer.component';

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [
        TemplateInforOrderComponent,
        TemplateFooterOrderComponent,
        TemplateTableComponent,
        TemplatePaginationComponent,
        TemplateSidebarComponent,
        TemplateHeaderComponent,
        TemplateTableProductComponent,
        TemplateCustomerComponent,
    ],
    exports: [
        TemplateInforOrderComponent,
        TemplateFooterOrderComponent,
        TemplateTableComponent,
        TemplatePaginationComponent,
        TemplateSidebarComponent,
        TemplateHeaderComponent,
        TemplateTableProductComponent,
        TemplateCustomerComponent,
    ],
})
export class TemplateComponentModule {}
