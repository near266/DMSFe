import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./core/layouts/main/main.module')
      .then(m => m.MainModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./core/layouts/auth/auth.module')
      .then(m => m.AuthModule),
  },
  { path: 'dispatchs', loadChildren: () => import('./features/dispatchs/dispatchs.module').then(m => m.DispatchsModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
