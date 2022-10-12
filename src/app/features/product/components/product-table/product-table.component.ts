import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { tableHeader } from '../../models/table.header';
import { Product } from '../../models/product';
declare let $: any;

@Component({
    selector: 'app-product-table',
    templateUrl: './product-table.component.html',
    styleUrls: ['./product-table.component.scss'],
})
export class ProductTableComponent implements OnInit {
    currentPage: number;
    products: Product[] = [];
    headers = tableHeader;
    constructor(private productService: ProductService) {}
    ngOnInit(): void {
        this.productService.products$.subscribe((data: Product[]) => {
            this.products = data;
        });
        this.productService.currentPage$.subscribe((data: number) => {
            this.currentPage = data;
        });
    }
}
