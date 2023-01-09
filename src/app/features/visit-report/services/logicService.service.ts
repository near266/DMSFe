import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VisitReportService } from 'src/app/core/services/visitReport.service';
import { FormatData } from '../component/table/table.component';
import { JGData } from '../mocks/fake';
import { VisitReport, VisitReportResponse } from '../model/VisitReport';
import { FormatDataToTableService } from './formatDataToTable.service';

@Injectable({
    providedIn: 'root',
})
export class LogicServiceService {
    private isLoadingSource = new BehaviorSubject<boolean>(true);
    private visitReportSource = new BehaviorSubject<FormatData[]>([]);
    private visitDetailReportSource = new BehaviorSubject<FormatData[]>([]);
    private totalSource = new BehaviorSubject<number>(0);

    isLoading$ = this.isLoadingSource.asObservable();
    visitReport$ = this.visitReportSource.asObservable();
    visitReportDetail$ = this.visitDetailReportSource.asObservable();
    total$ = this.totalSource.asObservable();

    constructor(private visitReportService: VisitReportService, private formatDataToTable: FormatDataToTableService) {}

    searchReport(body: any) {
        this.isLoadingSource.next(true);
        this.visitReportService.searchReport(body).subscribe((data: VisitReportResponse) => {
            let dataAfterFormat = this.formatDataToTable.formatListData(data);
            this.visitReportSource.next(dataAfterFormat);
            this.totalSource.next(data.totalCount);
            this.isLoadingSource.next(false);
        });
    }

    searchDetailReport(body: any) {
        this.isLoadingSource.next(true);
        this.visitReportService.searchReport(body).subscribe((data: VisitReportResponse) => {
            let dataAfterFormat = this.formatDataToTable.formatListDataDetailEmployee(data);
            this.visitDetailReportSource.next(dataAfterFormat);
            this.isLoadingSource.next(false);
        });
    }
}
