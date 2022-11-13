import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { OrderManagerComponent } from './order-manager.component';
import { OrderManagerRoutes } from './order-manager.routing';
import { CreatePurchaseComponent } from './purchase-mgm/create-purchase/create-purchase.component';
import { DetailPurchaseComponent } from './purchase-mgm/detail-purchase/detail-purchase.component';
import { PurchaseMgmModule } from './purchase-mgm/purchase-mgm.module';
import { PurchaseMgmRouting } from './purchase-mgm/purchase-mgm.routing';
import { TemplateHeaderComponent } from './template-component/template-header/template-header.component';
import { TemplatePaginationComponent } from './template-component/template-pagination/template-pagination.component';
import { TemplateSidebarComponent } from './template-component/template-sidebar/template-sidebar.component';
import { TemplateTableComponent } from './template-component/template-table/template-table.component';

@NgModule({
    imports: [CommonModule, SharedModule, OrderManagerRoutes],
    declarations: [OrderManagerComponent],
    exports: [],
})
export class OrderManagerModule {}
