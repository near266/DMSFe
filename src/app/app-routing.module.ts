import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./core/layouts/main/main.module').then((m) => m.MainModule),
    },
    {
        path: 'auth',
        loadChildren: () => import('./core/layouts/auth/auth.module').then((m) => m.AuthModule),
    },
    { path: 'returns', loadChildren: () => import('./features/returns/returns.module').then(m => m.ReturnsModule) }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
