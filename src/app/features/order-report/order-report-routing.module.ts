import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseReportComponent } from './components/purchase-report/purchase-report.component';
import { SaleReceiptReportComponent } from './components/sale-receipt-report/sale-receipt-report.component';
import { OrderReportComponent } from './order-report.component';

const routes: Routes = [
    {
        path: '',
        component: OrderReportComponent,
        children: [
            {
                path: 'purchase',
                component: PurchaseReportComponent,
            },
            {
                path: 'saleReceipt',
                component: SaleReceiptReportComponent,
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
