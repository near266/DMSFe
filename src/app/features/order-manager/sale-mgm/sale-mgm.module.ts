import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleMgmComponent } from './sale-mgm.component';
import { SaleMgmRouting } from './sale-mgm.routing';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { TableComponent } from './table/table.component';
import { DetailComponent } from './detail/detail.component';
import { CreateComponent } from './create/create.component';

@NgModule({
    imports: [CommonModule, SaleMgmRouting, SharedModule],
    declarations: [SaleMgmComponent, TableComponent, DetailComponent, CreateComponent],
})
export class SaleMgmModule {}
