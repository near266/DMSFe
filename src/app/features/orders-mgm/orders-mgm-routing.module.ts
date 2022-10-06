import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersMgmComponent } from './orders-mgm.component';

const routes: Routes = [{ path: '', component: OrdersMgmComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OrdersMgmRoutingModule {}
