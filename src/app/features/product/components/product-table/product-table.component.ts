import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { tableHeader } from '../../models/table.header';
import { Product } from '../../models/product';
import { ProductDialogService } from '../../services/product-dialog.service';
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
    constructor(private productService: ProductService, private productDialogService: ProductDialogService) {}
    ngOnInit(): void {
        this.productService.getAllProducts();
        this.productService.products$.subscribe((data: Product[]) => {
            this.products = data;
        });
        this.productService.currentPage$.subscribe((data: number) => {
            this.currentPage = data;
        });
    }
    openUpdateProduct(product: Product): void {
        this.productDialogService.openProductDialog(product);
    }
}
