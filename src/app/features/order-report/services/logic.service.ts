import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ReportService } from 'src/app/core/services/report.service';
import { RootOrderReport } from '../models/order-report';
import { RootSaleReport } from '../models/saleReports';
import { FormatReportOrderService } from './formatReportOrders.service';
import { FormtatReportSaleReceiptService } from './formtatReportSaleReceipt.service';
@Injectable({
    providedIn: 'root',
})
export class LogicService {
    private reportOrdersSource = new BehaviorSubject<any>('');
    private totalSource = new BehaviorSubject<number>(0);
    private isLoadingSource = new BehaviorSubject<boolean>(true);

    // lưu trữ data
    reportOrders$ = this.reportOrdersSource.asObservable();
    total$ = this.totalSource.asObservable();
    isLoading$ = this.isLoadingSource.asObservable();

    constructor(
        private reportService: ReportService,
        private formatOrder: FormatReportOrderService,
        private formatSale: FormtatReportSaleReceiptService,
    ) {}

    getAllReportOrders(body: any, from: string) {
        if (from === 'ordersReport') {
            this.isLoadingSource.next(true);
            this.reportService.OrderReport(body).subscribe((data: RootOrderReport) => {
                let dataReturn: RootOrderReport = data;
                this.totalSource.next(dataReturn.total);
                this.reportOrdersSource.next(this.formatOrder.formatReportOrders(dataReturn));
                this.isLoadingSource.next(false);
            });
        } else if (from === 'saleReceipt') {
            this.isLoadingSource.next(true);
            this.reportService.SaleReceiptReport(body).subscribe((data: RootSaleReport) => {
                let dataReturn: RootSaleReport = data;
                // console.log(dataReturn);
                this.totalSource.next(dataReturn.total);
                this.reportOrdersSource.next(this.formatSale.formatReportSale(dataReturn));
                this.isLoadingSource.next(false);
            });
        }
    }
}
