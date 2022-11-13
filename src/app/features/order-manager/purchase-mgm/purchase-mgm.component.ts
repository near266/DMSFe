import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PurchaseHeader } from '../models/headers';
import { PurchaseOrder, RootPurchases } from '../models/purchases';
import { FormatPurchaseService } from '../services/formatPurchase.service';
import { PurchaseLogicService } from '../services/purchaseLogic.service';

@Component({
    selector: 'app-purchase-mgm',
    templateUrl: './purchase-mgm.component.html',
    styleUrls: ['./purchase-mgm.component.scss'],
})
export class PurchaseMgmComponent implements OnInit, AfterViewInit {
    ngOnInit(): void {}
    ngAfterViewInit(): void {}
}
