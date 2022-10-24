import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReturnsRoutingModule } from './returns-routing.module';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { ReturnsComponent } from './returns.component';
import { ReturnsPaginationComponent } from './components/returns-pagination/returns-pagination.component';
import { ReturnsTableComponent } from './components/returns-table/returns-table.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CreateReturnComponent } from './components/create-return/create-return.component';

import { ReturnDialogComponent } from './components/return-dialog/return-dialog.component';
import { CreateReturnFormComponent } from './components/create-return/create-return-form/create-return-form.component';
import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { FormlyMatTextAreaModule } from '@ngx-formly/material/textarea';
import { CreateReturnTableComponent } from './components/create-return/create-return-table/create-return-table.component';
import { CreateReturnPromotionTableComponent } from './components/create-return/create-return-promotion-table/create-return-promotion-table.component';
import { CreateReturnFromOrderComponent } from './components/create-return/create-return-from-order/create-return-from-order.component';
import { ReturnOrderInfoComponent } from './components/create-return/create-return-from-order/return-order-info/return-order-info.component';
import { ReturnOrderProductsComponent } from './components/create-return/create-return-from-order/return-order-products/return-order-products.component';
import { ReturnOrderPromotionComponent } from './components/create-return/create-return-from-order/return-order-promotion/return-order-promotion.component';
import { NgSelectFormlyComponent } from './types/ng-select.type';

@NgModule({
    declarations: [
        ReturnsComponent,
        ReturnsPaginationComponent,
        ReturnsTableComponent,
        CreateReturnComponent,
        NgSelectFormlyComponent,
        ReturnDialogComponent,
        CreateReturnFormComponent,
        CreateReturnTableComponent,
        CreateReturnPromotionTableComponent,
        CreateReturnFromOrderComponent,
        ReturnOrderInfoComponent,
        ReturnOrderProductsComponent,
        ReturnOrderPromotionComponent,
    ],
    imports: [
        CommonModule,
        ReturnsRoutingModule,
        NgxPaginationModule,
        FormlyModule.forChild({
            types: [
                {
                    name: 'autocomplete-formly',
                    component: NgSelectFormlyComponent,
                },
            ],
        }),
        FormlySelectModule,
        FormlyMaterialModule,
        FormlyMatDatepickerModule,
        FormlyMatTextAreaModule,
        SharedModule,
    ],
})
export class ReturnsModule {}
