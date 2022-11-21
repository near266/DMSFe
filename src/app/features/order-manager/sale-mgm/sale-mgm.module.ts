import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { TemplateComponentModule } from '../template-component/template-component.module';
import { CreateComponent } from './create/create.component';
import { DetailContainerComponent } from './detail-container/detail-container.component';
import { DetailContainerModule } from './detail-container/detail-container.module';
import { SaleMgmComponent } from './sale-mgm.component';
import { SaleMgmRouting } from './sale-mgm.routing';
import { TableComponent } from './table/table.component';

@NgModule({
    imports: [CommonModule, SaleMgmRouting, SharedModule, DetailContainerModule, TemplateComponentModule],
    declarations: [SaleMgmComponent, TableComponent, DetailContainerComponent, CreateComponent],
})
export class SaleMgmModule {}
