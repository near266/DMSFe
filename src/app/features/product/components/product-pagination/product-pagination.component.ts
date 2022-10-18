import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
    selector: 'app-product-pagination',
    templateUrl: './product-pagination.component.html',
    styleUrls: ['./product-pagination.component.scss'],
})
export class ProductPaginationComponent implements OnInit {
    startIndex: number;
    endIndex: number;
    totalProducts: number;
    constructor(private productService: ProductService) {}

    ngOnInit(): void {
        this.productService.totalProducts$.subscribe((total) => (this.totalProducts = total));
        this.productService.startAndEndIndex$.subscribe((data: { start: number; end: number }) => {
            this.startIndex = data.start;
            this.endIndex = data.end;
        });
    }
    handlePageChange(page: number): void {
        this.productService.setCurrentPage(page);
    }
}
