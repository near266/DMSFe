import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';

const routes: Routes = [
	{
		path: '',
		component: MainComponent,
		children: [
			{ path: 'product', loadChildren: () => import('../../../features/product/product.module').then(m => m.ProductModule) },
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
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class MainRoutingModule { }