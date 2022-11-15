import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { DetailComponent } from './detail/detail.component';
import { SaleMgmComponent } from './sale-mgm.component';
import { TableComponent } from './table/table.component';

const routes: Routes = [
    {
        path: '',
        component: SaleMgmComponent,
        children: [
            {
                path: '',
                component: TableComponent,
            },
            {
                path: 'create',
                component: CreateComponent,
            },
            {
                path: 'detail',
                component: DetailComponent,
            },
        ],
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SaleMgmRouting {}
