import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailContainerComponent } from './detail-container.component';
import { CustomerComponent } from './customer/customer.component';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './detail/detail.component';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { TemplateComponentModule } from '../../template-component/template-component.module';

const routes: Routes = [
    {
        path: '',
        component: DetailContainerComponent,
        children: [
            {
                path: 'viewEdit',
                component: DetailComponent,
            },
            {
                path: 'customer',
                component: CustomerComponent,
            },
        ],
    },
];

@NgModule({
    declarations: [DetailComponent, CustomerComponent],
    imports: [CommonModule, SharedModule, RouterModule.forChild(routes), TemplateComponentModule],
})
export class DetailContainerModule {}
