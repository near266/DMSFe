import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateTableComponent } from './common-template/template-table/template-table.component';
import { OrderReportComponent } from './order-report.component';

const routes: Routes = [
    {
        path: '',
        component: OrderReportComponent,
        children: [
            {
                path: 'template',
                component: TemplateTableComponent,
            },
        ],
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OrderReportRoutingModule {}
