import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PurchaseDetail } from '../../models/purchaseDetail';
import { CommonLogicService } from '../../services/commonLogic.service';
import { PurchaseLogicService } from '../../services/purchaseLogic.service';

@Component({
    selector: 'app-detail-container',
    templateUrl: './detail-container.component.html',
    styleUrls: ['./detail-container.component.scss'],
})
export class DetailContainerComponent implements OnInit, AfterViewInit {
    roleMain: string = 'member';
    isEdit: boolean = false;
    statusNow: number;

    constructor(private commonLogicService: CommonLogicService, private purchaseLogicService: PurchaseLogicService) {}

    ngOnInit(): void {
        this.roleMain = localStorage.getItem('roleMain')!;
        this.purchaseLogicService.detail$.subscribe((data: PurchaseDetail) => {
            this.statusNow = data.status;
        });
    }

    ngAfterViewInit(): void {}

    changeType() {
        this.isEdit = !this.isEdit;
        this.commonLogicService.changeTypeEdit(this.isEdit);
    }
}
