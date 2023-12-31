import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseMgmComponent } from './purchase-mgm.component';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { PurchaseMgmRouting } from './purchase-mgm.routing';
import { DetailPurchaseComponent } from './detail-container/detail-purchase/detail-purchase.component';
import { CreatePurchaseComponent } from './create-purchase/create-purchase.component';
import { TemplateHeaderComponent } from '../template-component/template-header/template-header.component';
import { PurchaseTableComponent } from './purchase-table/purchase-table.component';
import { TemplateComponentModule } from '../template-component/template-component.module';
import { GenSaleComponent } from './gen-sale/gen-sale.component';

@NgModule({
    imports: [CommonModule, SharedModule, PurchaseMgmRouting, TemplateComponentModule],
    declarations: [PurchaseMgmComponent, CreatePurchaseComponent, DetailPurchaseComponent, PurchaseTableComponent, GenSaleComponent],
})
export class PurchaseMgmModule {}
