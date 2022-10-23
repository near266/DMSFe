import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewEditDetailReturnRoutingModule } from './view-edit-detail-return-routing.module';
import { DetailReturnInfoComponent } from './detail-return/detail-return-info/detail-return-info.component';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { ViewEditDetailReturnComponent } from './view-edit-detail-return.component';
import { DetailReturnComponent } from './detail-return/detail-return.component';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { FormlyMatTextAreaModule } from '@ngx-formly/material/textarea';
import { DetailReturnTableComponent } from './detail-return/detail-return-table/detail-return-table.component';
import { DetailReturnTableEditComponent } from './detail-return/detail-return-table-edit/detail-return-table-edit.component';
import { DetailReturnPromotionComponent } from './detail-return/detail-return-promotion/detail-return-promotion.component';
import { DetailReturnTablePromotionEditComponent } from './detail-return/detail-return-table-promotion-edit/detail-return-table-promotion-edit.component';

@NgModule({
    declarations: [
        DetailReturnInfoComponent,
        ViewEditDetailReturnComponent,
        DetailReturnComponent,
        DetailReturnTableComponent,
        DetailReturnTableEditComponent,
        DetailReturnPromotionComponent,
        DetailReturnTablePromotionEditComponent,
    ],
    imports: [
        CommonModule,
        ViewEditDetailReturnRoutingModule,
        SharedModule,
        FormlyModule.forChild(),
        FormlySelectModule,
        FormlyMaterialModule,
        FormlyMatDatepickerModule,
        FormlyMatTextAreaModule,
    ],
})
export class ViewEditDetailReturnModule {}
