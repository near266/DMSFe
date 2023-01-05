import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VisitReportService } from 'src/app/core/services/visitReport.service';
import { FormatData } from '../component/table/table.component';
import { JGData } from '../mocks/fake';
import { VisitReport } from '../model/VisitReport';
import { FormatDataToTableService } from './formatDataToTable.service';

@Injectable({
    providedIn: 'root',
})
export class LogicServiceService {
    private isLoadingSource = new BehaviorSubject<boolean>(true);
    private visitReportSource = new BehaviorSubject<FormatData[]>([]);

    isLoading$ = this.isLoadingSource.asObservable();
    visitReport$ = this.visitReportSource.asObservable();

    constructor(private visitReportService: VisitReportService, private formatDataToTable: FormatDataToTableService) {}

    searchReport(body: any) {
        this.isLoadingSource.next(true);
        this.visitReportService.searchReport(body).subscribe((data: { data: VisitReport[] }) => {
            // this.visitReportSource.next(this.formatData(data));
            console.log(data);
            let dataAfterFormat = this.formatData(data);
            this.visitReportSource.next(dataAfterFormat);
            this.isLoadingSource.next(false);
        });
    }

    // format bảng ngoài cùng
    formatData(data: { data: VisitReport[] }): any {
        return this.formatDataToTable.formatListData(data);
    }
}
