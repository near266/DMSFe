import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { Observable } from 'rxjs';
import { Config } from 'src/app/core/model/Config';
import { ReportService } from 'src/app/core/services/report.service';
import { RootOrderReport } from '../../models/order-report';
import { LogicService } from '../../services/logic.service';
@Component({
    selector: 'app-purchase-report',
    templateUrl: './purchase-report.component.html',
    styleUrls: ['./purchase-report.component.scss'],
})
export class PurchaseReportComponent implements OnInit {
    dateSearchForm: FormGroup;
    // todo menu
    statusMenu: Config = {
        icon: '<i class="fa-solid fa-user"></i>',
        title: 'Loại khách hàng',
        menuChildrens: ['Tất cả', 'Tiềm năng', 'Thân thiết', 'Vãng lai'],
    };

    total$: Observable<number> = this.logicService.total$;
    dataOrderReport: RootOrderReport = new RootOrderReport();
    body: any = {
        page: 1,
        pageSize: 30,
    };

    constructor(private _reportSer: ReportService, private logicService: LogicService, private fb: FormBuilder) {}

    ngOnInit(): void {
        this.dateSearchForm = this.fb.group({
            startDate: [null],
            endDate: [null],
        });
    }

    handleEmitBody(body: any) {
        body.page = 1;
        body.pageSize = 30;
        this.body = body;
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
}
