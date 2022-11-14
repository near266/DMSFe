import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { OrderManagerComponent } from './order-manager.component';
import { OrderManagerRoutes } from './order-manager.routing';
import { SaleMgmComponent } from './sale-mgm/sale-mgm.component';
import { CreateComponent } from './sale-mgm/create/create.component';
import { DetailComponent } from './sale-mgm/detail/detail.component';
import { TableComponent } from './sale-mgm/table/table.component';
import { SaleMgmModule } from './sale-mgm/sale-mgm.module';

@NgModule({
    imports: [CommonModule, SharedModule, OrderManagerRoutes],
    declarations: [OrderManagerComponent],
    exports: [],
})
export class OrderManagerModule {}
