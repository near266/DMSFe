import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { tableHeader } from '../../models/table.header';
import { Product } from '../../models/product';
import { ProductDialogService } from '../../services/product-dialog.service';
import { Observable, Subscription } from 'rxjs';
declare let $: any;

@Component({
    selector: 'app-product-table',
    templateUrl: './product-table.component.html',
    styleUrls: ['./product-table.component.scss'],
})
export class ProductTableComponent implements OnInit, AfterViewInit {
    currentPage: number;
    products: Product[] = [];
    _tableLoading$: Observable<boolean>;
    headers = tableHeader;
    totalItems: number;
    listIds: string[] = [];
    subscriptions: Subscription = new Subscription();
    constructor(private productService: ProductService, private productDialogService: ProductDialogService) {}
    ngOnInit(): void {
        this.subscriptions.add(
            this.productService.isSucess$.subscribe((data) => {
                if (data === true) {
                    this.listIds = [];
                    this.getData();
                }
            }),
        );
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.getData();
        });
    }

    private getData() {
        this._tableLoading$ = this.productService.tableLoading$;
        this.productService.getInititalProducts();
        this.productService.products$.subscribe((data: Product[]) => {
            this.products = data;
            this.filterProduct();
        });
        this.productService.totalProducts$.subscribe((data: number) => {
            this.totalItems = data;
        });
        this.productService.currentPage$.subscribe((data: number) => {
            this.currentPage = data;
        });
    }

    openUpdateProduct(product: Product): void {
        this.productDialogService.openProductDialog(product);
    }
    filterProduct() {
        this.products.forEach((product: any) => {
            if (this.listIds.includes(product.id!)) {
                product.checked = true;
            }
        });
    }
    check(id: string, e: any): void {
        if (e.target.checked) {
            this.listIds.push(id);
        } else {
            this.listIds = this.listIds.filter((idProd: string) => {
                return idProd != id;
            });
        }
        this.productService.setListProductArchive(this.listIds);
    }

    checkAll(e: any) {
        if (e.target.checked) {
            this.listIds = this.products.map((product: Product) => {
                product.checked = true;
                return product.id!;
            });
        } else {
            this.products.forEach((product: Product) => {
                product.checked = false;
            });
            this.listIds = [];
        }
        this.productService.setListProductArchive(this.listIds);
    }
}
