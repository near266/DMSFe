import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SaleDetail } from '../../models/saleDetail';
import { CommonLogicService } from '../../services/commonLogic.service';
import { SaleLogicService } from '../../services/saleLogic.service';

@Component({
    selector: 'app-detail-container',
    templateUrl: './detail-container.component.html',
    styleUrls: ['./detail-container.component.scss'],
})
export class DetailContainerComponent implements OnInit, AfterViewInit {
    roleMain: string = 'member';
    statusNow: number;
    isEdit: boolean = false;
    id: string = '';

    constructor(private saleLogicService: SaleLogicService, private commonLogicService: CommonLogicService) {}

    ngOnInit(): void {
        this.roleMain = localStorage.getItem('roleMain')!;
    }
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.getStatusNow();
        });
    }

    getStatusNow() {
        this.saleLogicService.detailOrder$.subscribe((data: SaleDetail) => {
            this.statusNow = data.status;
        });
    }

    changeType() {
        this.isEdit = !this.isEdit;
        this.commonLogicService.changeTypeEdit(this.isEdit);
    }
}
