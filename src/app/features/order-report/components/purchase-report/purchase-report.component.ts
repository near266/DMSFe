import { Component, OnInit } from '@angular/core';
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
