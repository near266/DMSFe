import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderSaleMgmComponent } from './order-sale-mgm.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: OrderSaleMgmComponent
  }
]

@NgModule({
  declarations: [
    OrderSaleMgmComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class OrderSaleMgmModule { }
