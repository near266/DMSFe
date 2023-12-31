import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { DetailProductTableComponent } from './features/orders-mgm/components/detail-order/detail-product-table/detail-product-table.component';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./core/layouts/main/main.module').then((m) => m.MainModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'auth',
        loadChildren: () => import('./core/layouts/auth/auth.module').then((m) => m.AuthModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
