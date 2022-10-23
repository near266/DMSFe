import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateReturnFromOrderComponent } from './components/create-return/create-return-from-order/create-return-from-order.component';
import { CreateReturnComponent } from './components/create-return/create-return.component';
import { ReturnsComponent } from './returns.component';

const routes: Routes = [
    { path: '', component: ReturnsComponent },

    {
        path: 'create_return_order',
        component: CreateReturnComponent,
    },
    {
        path: 'return_from_order',
        component: CreateReturnFromOrderComponent,
    },
    {
        path: 'details',
        loadChildren: () =>
            import('./components/view-edit-detail-return/view-edit-detail-return.module').then(
                (m) => m.ViewEditDetailReturnModule,
            ),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReturnsRoutingModule {}
