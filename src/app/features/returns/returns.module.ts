import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReturnsRoutingModule } from './returns-routing.module';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { ReturnsComponent } from './returns.component';
import { ReturnsPaginationComponent } from './components/returns-pagination/returns-pagination.component';
import { ReturnsTableComponent } from './components/returns-table/returns-table.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CreateReturnComponent } from './components/create-return/create-return.component';
import { ViewEditDetailReturnComponent } from './components/view-edit-detail-return/view-edit-detail-return.component';
import { DetailReturnComponent } from './components/detail-return/detail-return.component';
import { ReturnDialogComponent } from './components/return-dialog/return-dialog.component';
import { CreateReturnFormComponent } from './components/create-return/create-return-form/create-return-form.component';
import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { FormlyMatTextAreaModule } from '@ngx-formly/material/textarea';
import { CreateReturnTableComponent } from './components/create-return/create-return-table/create-return-table.component';
import { CreateReturnPromotionTableComponent } from './components/create-return/create-return-promotion-table/create-return-promotion-table.component';

@NgModule({
    declarations: [
        ReturnsComponent,
        ReturnsPaginationComponent,
        ReturnsTableComponent,
        CreateReturnComponent,
        ViewEditDetailReturnComponent,
        DetailReturnComponent,
        ReturnDialogComponent,
        CreateReturnFormComponent,
        CreateReturnTableComponent,
        CreateReturnPromotionTableComponent,
    ],
    imports: [
        CommonModule,
        ReturnsRoutingModule,
        NgxPaginationModule,
        SharedModule,
        FormlyModule.forChild(),
        FormlySelectModule,
        FormlyMaterialModule,
        FormlyMatDatepickerModule,
        FormlyMatTextAreaModule,
    ],
})
export class ReturnsModule {}
