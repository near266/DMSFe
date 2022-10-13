import { Component, OnInit } from '@angular/core';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { ProductService } from 'src/app/features/product/services/product.service';

@Component({
    selector: 'app-panagation',
    templateUrl: './panagation.component.html',
    styleUrls: ['./panagation.component.scss'],
})
export class PanagationComponent implements OnInit {
    startIndex: number;
    endIndex: number;
    page: number = 1;
    pageSize: number = 30;
    total: number = 0;
    constructor(private productService: ProductService, private purchaseOrderService: PurchaseOrderService) {}
    ngOnInit(): void {
        this.purchaseOrderService.total.subscribe((data) => {
            this.total = data;
            this.setIndexToFirstPage();
        });
    }
    setIndexToFirstPage() {
        this.startIndex = 1;
        this.endIndex = Math.min(this.startIndex + this.pageSize, this.total);
    }
    setIndexToSecondPageToDiffrentFirstPage(event: any) {
        this.startIndex = (event-1)*this.pageSize + event;
        this.endIndex = Math.min(this.startIndex + this.pageSize, this.total);
    }

    onTableDataChange(event: any) {
        if (event === 1) {
            this.setIndexToFirstPage();
        } else {
            this.setIndexToSecondPageToDiffrentFirstPage(event);
        }
        this.page = event;
        this.purchaseOrderService.changePage(this.page);
    }

    getStartAndEndIndex() {}

    onTableSizeChange(event: any): void {
        this.pageSize = event.target.value;
        this.page = 1;
        // this.fetchPosts();
    }
}
