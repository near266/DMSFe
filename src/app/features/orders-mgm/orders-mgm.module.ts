import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrdersMgmComponent } from './orders-mgm.component';
import { DispatchsRoutingModule } from '../dispatchs/dispatchs-routing.module';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { OrdersMgmRoutingModule } from './orders-mgm-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
    declarations: [SidebarComponent, OrdersMgmComponent],
    imports: [CommonModule, SharedModule, OrdersMgmRoutingModule, RouterModule],
})
export class OrdersMgmModule {}
