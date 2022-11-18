import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DetailPurchaseComponent } from './detail-purchase/detail-purchase.component';
import { DetailContainerComponent } from './detail-container.component';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { DetailCustomerComponent } from './detail-customer/detail-customer.component';
import { TemplateComponentModule } from '../../template-component/template-component.module';

const routes: Routes = [
    {
        path: '',
        component: DetailContainerComponent,
        children: [
            {
                path: '',
                redirectTo: 'viewEdit',
                pathMatch: 'full',
            },
            {
                path: 'viewEdit',
                component: DetailPurchaseComponent,
            },
            {
                path: 'customer',
                component: DetailCustomerComponent,
            },
        ],
    },
];

@NgModule({
    declarations: [DetailContainerComponent, DetailCustomerComponent],
    imports: [CommonModule, RouterModule.forChild(routes), SharedModule, TemplateComponentModule],
})
export class DetailContainerModule {}
