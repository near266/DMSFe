import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PurchaseDetail } from '../../../models/purchaseDetail';
import { PurchaseLogicService } from '../../../services/purchaseLogic.service';

@Component({
    selector: 'app-detail-customer',
    templateUrl: './detail-customer.component.html',
    styleUrls: ['./detail-customer.component.scss'],
})
export class DetailCustomerComponent implements OnInit {
    customerId: string;
    constructor() {}

    ngOnInit(): void {
        this.customerId = localStorage.getItem('customerId')!;
    }
}
