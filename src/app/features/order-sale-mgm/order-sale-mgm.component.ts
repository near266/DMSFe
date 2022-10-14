import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PurchaseOrder } from 'src/app/core/model/PurchaseOrder';
import { SaleReceipt } from 'src/app/core/model/SaleReceipt';
import { SaleReceiptService } from 'src/app/core/services/saleReceipt.service';

@Component({
    selector: 'app-order-sale-mgm',
    templateUrl: './order-sale-mgm.component.html',
    styleUrls: ['./order-sale-mgm.component.scss'],
})
export class OrderSaleMgmComponent implements OnInit {
    isShowSidebarToMargin = true;
    sideBarWidth!: string;
    type!: string;
    listReceiptOreder: SaleReceipt[] = [];
    listOrder: PurchaseOrder[] = [];
    totalCount: number;

    page: number = 1;
    pageSize: number = 30;
    total: number = 0;

    constructor(
        private activatedroute: ActivatedRoute,
        public datepipe: DatePipe,
        private saleReceiptService: SaleReceiptService,
    ) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.saleReceiptService.search().subscribe((data) => {
            this.listReceiptOreder = data.data;
        });
    }

    ngDoCheck(): void {
        let table = document.getElementById('table');
        table?.classList.add('width-vw-260');
        if (this.isShowSidebarToMargin) {
            table?.classList.remove('width-vw-60');
            table?.classList.add('width-vw-260');
        } else {
            table?.classList.add('width-vw-60');
            table?.classList.remove('width-vw-260');
        }
    }

    ngOnDestroy(): void {}

    isShowSidebar(e: any) {
        this.isShowSidebarToMargin = e;
        let table = document.getElementById('table');
        if (this.isShowSidebarToMargin) {
            table?.classList.remove('width-vw-60');
            table?.classList.add('width-vw-260');
        } else {
            table?.classList.add('width-vw-60');
            table?.classList.remove('width-vw-260');
        }
    }
}
