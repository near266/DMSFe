import { Component, OnInit } from '@angular/core';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';

@Component({
    selector: 'app-product-pagination',
    templateUrl: './product-pagination.component.html',
    styleUrls: ['./product-pagination.component.scss'],
})
export class ProductPaginationComponent implements OnInit {
    startIndex: number;
    endIndex: number;
    page: number = 1;
    pageSize: number = 30;
    total: number = 0;
    constructor(private purchaseOrderService: PurchaseOrderService) {}

    ngOnInit(): void {}

    onTableDataChange(event: any) {
        if (event === 1) {
            this.setIndexToFirstPage();
        } else {
            this.setIndexToSecondPageToDiffrentFirstPage(event);
        }
        this.page = event;
        this.purchaseOrderService.changePage(this.page);
    }

    setIndexToFirstPage() {
        this.startIndex = 1;
        this.endIndex = Math.min(this.startIndex + this.pageSize, this.total);
    }
    setIndexToSecondPageToDiffrentFirstPage(event: any) {
        this.startIndex = (event - 1) * this.pageSize + event;
        this.endIndex = Math.min(this.startIndex + this.pageSize, this.total);
    }
}
