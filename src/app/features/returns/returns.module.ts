import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReturnsRoutingModule } from './returns-routing.module';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { ReturnsComponent } from './returns.component';
import { ReturnsPaginationComponent } from './components/returns-pagination/returns-pagination.component';
import { ReturnsTableComponent } from './components/returns-table/returns-table.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
    declarations: [ReturnsComponent, ReturnsPaginationComponent, ReturnsTableComponent],
    imports: [CommonModule, ReturnsRoutingModule, NgxPaginationModule, SharedModule],
})
export class ReturnsModule {}
