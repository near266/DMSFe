import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreatePurchaseComponent } from './create-purchase/create-purchase.component';
import { DetailPurchaseComponent } from './detail-container/detail-purchase/detail-purchase.component';
import { PurchaseMgmComponent } from './purchase-mgm.component';
import { PurchaseTableComponent } from './purchase-table/purchase-table.component';

const routes: Routes = [
    {
        path: '',
        component: PurchaseMgmComponent,
        children: [
            {
                path: '',
                component: PurchaseTableComponent,
            },
            {
                path: 'create',
                component: CreatePurchaseComponent,
            },
            {
                path: 'detail',
                loadChildren: () =>
                    import('./detail-container/detail-container.module').then((m) => m.DetailContainerModule),
            },
        ],
    },
];
@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PurchaseMgmRouting {}
