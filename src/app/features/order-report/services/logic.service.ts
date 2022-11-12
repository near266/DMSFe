import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ReportService } from 'src/app/core/services/report.service';
import { RootOrderReport } from '../models/order-report';
import { stickyRows } from '../models/stickyRow';
import { FormatService } from './format.service';
@Injectable({
    providedIn: 'root',
})
export class LogicService {
    private reportOrdersSource = new BehaviorSubject<any>('');
    private totalSource = new BehaviorSubject<number>(0);
    private isLoadingSource = new BehaviorSubject<boolean>(true);

    reportOrders$ = this.reportOrdersSource.asObservable();
    total$ = this.totalSource.asObservable();
    isLoading$ = this.isLoadingSource.asObservable();

    constructor(private reportService: ReportService, private format: FormatService) {}

    getAllReportOrders(body: any) {
        this.isLoadingSource.next(true);
        this.reportService.OrderReport(body).subscribe((data) => {
            let dataReturn: RootOrderReport = data;
            this.totalSource.next(dataReturn.total);
            this.reportOrdersSource.next(this.format.formatDataOrders(dataReturn.data));
            this.isLoadingSource.next(false);
        });
    }
}
