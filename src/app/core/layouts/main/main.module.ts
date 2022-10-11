import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { MainComponent } from './main.component';
import { ComponentModule } from '../../component/component.module';

const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [
            {
                path: 'dispatchs',
                loadChildren: () =>
                    import('../../../features/dispatchs/dispatchs.module').then((m) => m.DispatchsModule),
            },
            {
                path: 'orders',
                loadChildren: () =>
                    import('../../../features/orders-mgm/orders-mgm.module').then((m) => m.OrdersMgmModule),
            },
            {
                path: 'ordersale',
                loadChildren: () =>
                    import('../../../features/order-sale-mgm/order-sale-mgm.module').then((m) => m.OrderSaleMgmModule),
            },
            {
                path: 'warehouses',
                loadChildren: () =>
                    import('../../../features/warehouse/warehouse.module').then(m => m.WarehouseModule)
            },
            {
                path: 'categories',
                loadChildren: () =>
                    import('../../../features/user-manage/categories.module').then((m) => m.UserManageModule),
            },
            {
                path: 'customers',
                loadChildren: () =>
                import('../../../features/customers/customers.module').then(m => m.CustomersModule)
            }
        ],
    },
];

@NgModule({
    declarations: [MainComponent],
    imports: [CommonModule, SharedModule, RouterModule, ComponentModule, RouterModule.forChild(routes)],
})
export class MainModule { }
