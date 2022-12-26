import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VisitReportService } from 'src/app/core/services/visitReport.service';
import { JGData } from '../mocks/fake';
import { VisitReport } from '../model/VisitReport';
import { FormatDataToTableService } from './formatDataToTable.service';

@Injectable({
    providedIn: 'root',
})
export class LogicServiceService {
    private isLoadingSource = new BehaviorSubject<boolean>(true);
    private visitReportSource = new BehaviorSubject<{ data: VisitReport[] }>({ data: [] });

    isLoading$ = this.isLoadingSource.asObservable();
    visitReport$ = this.visitReportSource.asObservable();

    constructor(private visitReportService: VisitReportService, private formatDataToTable: FormatDataToTableService) {}

    searchReport(body: any) {
        this.isLoadingSource.next(true);
        // this.visitReportService.searchReport(body).subscribe(
        //   (data: {data: VisitReport[]}) => {
        //       // this.visitReportSource.next(this.formatData(data));
        //       this.visitReportSource.next(data);
        //       this.isLoadingSource.next(false);
        //   }
        // )
        let dataAfterFormat = this.formatData(JGData);
        this.visitReportSource.next(dataAfterFormat);
    }

    // format bảng ngoài cùng
    formatData(data: { data: VisitReport[] }): any {
        return this.formatDataToTable.formatListData(data, 28);
    }
}
