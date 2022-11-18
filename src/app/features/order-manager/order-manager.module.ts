import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { OrderManagerComponent } from './order-manager.component';
import { OrderManagerRoutes } from './order-manager.routing';
import { TemplateComponentModule } from './template-component/template-component.module';

@NgModule({
    imports: [CommonModule, SharedModule, OrderManagerRoutes],
    declarations: [OrderManagerComponent],
    exports: [],
})
export class OrderManagerModule {}
