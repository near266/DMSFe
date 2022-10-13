import { Component, OnInit } from '@angular/core';
import { SaleReceiptService } from 'src/app/core/services/saleReceipt.service';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
    startIndex: number;
    endIndex: number;
    page: number = 1;
    pageSize: number = 30;
    total: number = 0;
    constructor(private saleReceipt: SaleReceiptService) {}
    ngOnInit(): void {
        this.saleReceipt.total.subscribe((data) => {
            this.total = data;
            this.setIndexToFirstPage();
        });
    }
    setIndexToFirstPage() {
        this.startIndex = 1;
        this.endIndex = Math.min(this.startIndex + this.pageSize, this.total);
    }
    setIndexToSecondPageToDiffrentFirstPage(event: any) {
        this.startIndex = (event - 1) * this.pageSize + event;
        this.endIndex = Math.min(this.startIndex + this.pageSize, this.total);
    }

    onTableDataChange(event: any) {
        if (event === 1) {
            this.setIndexToFirstPage();
        } else {
            this.setIndexToSecondPageToDiffrentFirstPage(event);
        }
        this.page = event;
        this.saleReceipt.changePage(this.page);
    }

    getStartAndEndIndex() {}

    onTableSizeChange(event: any): void {
        this.pageSize = event.target.value;
        this.page = 1;
        // this.fetchPosts();
    }
}
