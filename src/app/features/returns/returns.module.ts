import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReturnsRoutingModule } from './returns-routing.module';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { ReturnsComponent } from './returns.component';
import { ReturnsPaginationComponent } from './components/returns-pagination/returns-pagination.component';
import { ReturnsTableComponent } from './components/returns-table/returns-table.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CreatReturnComponent } from './components/creat-return/creat-return.component';
import { ViewEditDetailReturnComponent } from './components/view-edit-detail-return/view-edit-detail-return.component';
import { DetailReturnComponent } from './components/detail-return/detail-return.component';

@NgModule({
    declarations: [ReturnsComponent, ReturnsPaginationComponent, ReturnsTableComponent, CreatReturnComponent, ViewEditDetailReturnComponent, DetailReturnComponent],
    imports: [CommonModule, ReturnsRoutingModule, NgxPaginationModule, SharedModule],
})
export class ReturnsModule {}
