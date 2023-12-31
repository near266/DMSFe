import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryGuard } from '../../guards/category.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { MainComponent } from './main.component';

const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [
            {
                canActivate: [RolesGuard],
                path: 'product',
                loadChildren: () => import('../../../features/product/product.module').then((m) => m.ProductModule),
            },
            {
                path: 'returns',
                loadChildren: () => import('../../../features/returns/returns.module').then((m) => m.ReturnsModule),
            },
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
                    import('../../../features/warehouse/warehouse.module').then((m) => m.WarehouseModule),
            },
            {
                canActivate: [CategoryGuard],
                path: 'categories',
                loadChildren: () =>
                    import('../../../features/user-manage/categories.module').then((m) => m.UserManageModule),
            },
            {
                path: 'customers',
                loadChildren: () =>
                    import('../../../features/customers/customers.module').then((m) => m.CustomersModule),
            },
            {
                path: 'route',
                loadChildren: () => import('../../../features/route/route.module').then((m) => m.RouteModule),
            },
            {
                path: 'order-report',
                loadChildren: () =>
                    import('./../../../features/order-report/order-report.module').then((m) => m.OrderReportModule),
            },
            {
                path: 'reports',
                loadChildren: () =>
                    import('./../../../features/timekeeping/timekeeping.module').then((m) => m.TimekeepingModule),
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'order',
            },
            {
                path: 'order',
                loadChildren: () =>
                    import('./../../../features/order-manager/order-manager.module').then((m) => m.OrderManagerModule),
            },
            {
                path: 'reportVisit',
                loadChildren: () =>
                    import('./../../../features/visit-report/visit-report.module').then((m) => m.VisitReportModule),
            },
            {
                path: 'photo',
                loadChildren: () => import('./../../../features/photos/photos.module').then((m) => m.PhotosModule),
            },
            {
                path: 'recycle',
                loadChildren: () => import('./../../../features/recycle/recycle.module').then((m) => m.RecycleModule),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MainRoutingModule {}
