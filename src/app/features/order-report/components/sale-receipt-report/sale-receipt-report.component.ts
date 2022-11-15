import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LogicService } from '../../services/logic.service';

@Component({
    selector: 'app-sale-receipt-report',
    templateUrl: './sale-receipt-report.component.html',
    styleUrls: ['./sale-receipt-report.component.scss'],
})
export class SaleReceiptReportComponent implements OnInit {
    total$: Observable<number> = this.logicService.total$;
    constructor(private logicService: LogicService) {}

    ngOnInit(): void {}
}
