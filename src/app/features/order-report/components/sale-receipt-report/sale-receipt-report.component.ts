import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { Observable } from 'rxjs';
import { LogicService } from '../../services/logic.service';
import { SaleReportService } from '../../services/saleReport.service';

@Component({
    selector: 'app-sale-receipt-report',
    templateUrl: './sale-receipt-report.component.html',
    styleUrls: ['./sale-receipt-report.component.scss'],
})
export class SaleReceiptReportComponent implements OnInit {
    dateSearchForm: FormGroup;
    body: any = {
        page: 1,
        pageSize: 30,
    };
    total$: Observable<number> = this.logicService.total$;
    constructor(
        private logicService: LogicService,
        private fb: FormBuilder,
        private saleReportLogic: SaleReportService,
        private async: AsyncPipe,
    ) { }

    ngOnInit(): void {
        this.dateSearchForm = this.fb.group({
            startDate: [null],
            endDate: [null],
        });
    }

    clearDatePicker() {
        this.dateSearchForm.setValue({
            startDate: null,
            endDate: null,
        });
    }

    filterDate() {
        let startDate: string | null = null;
        let endDate: string | null = null;
        if (this.dateSearchForm.get('startDate')?.value) {
            startDate = moment(this.dateSearchForm.get('startDate')?.value).format('YYYY-MM-DD');
        }
        if (this.dateSearchForm.get('endDate')?.value) {
            endDate = moment(this.dateSearchForm.get('endDate')?.value).format('YYYY-MM-DD');
        }
        this.body.startDate = startDate;
        this.body.endDate = endDate;
    }

    handleEmitBody(body: any) {
        body.page = 1;
        body.pageSize = 30;
        this.body = body;
    }

    exportGross() {
        this.total$.subscribe((data) => {
            let body = {
                ...this.body,
            };
            body.pageSize = this.total$;
            this.saleReportLogic.exportGross(body, this.async.transform(this.total$)!);
        });
    }

    exportNotGross() {
        this.total$.subscribe((data) => {
            let body = {
                ...this.body,
            };
            body.pageSize = this.total$;
            this.saleReportLogic.exportNotGross(body, this.async.transform(this.total$)!);
        });
    }
}
