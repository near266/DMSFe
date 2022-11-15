import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from 'src/app/core/model/Config';
import { ReportService } from 'src/app/core/services/report.service';
import { RootOrderReport } from './models/order-report';
import { LogicService } from './services/logic.service';

@Component({
    selector: 'app-order-report',
    templateUrl: './order-report.component.html',
    styleUrls: ['./order-report.component.scss'],
})
export class OrderReportComponent implements OnInit {
    // todo menu
    statusMenu: Config = {
        icon: '<i class="fa-solid fa-user"></i>',
        title: 'Loại khách hàng',
        menuChildrens: ['Tất cả', 'Tiềm năng', 'Thân thiết', 'Vãng lai'],
    };

    total$: Observable<number> = this.logicService.total$;
    dataOrderReport: RootOrderReport = new RootOrderReport();

    constructor(private _reportSer: ReportService, private logicService: LogicService) {}

    ngOnInit(): void {}

    selectType(event: any) {
        console.log(event);
    }
}
