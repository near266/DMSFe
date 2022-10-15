import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { Product } from 'src/app/core/model/PurchaseOrder';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy, AfterViewInit {
    isSelectAll = false;
    subscription: Subscription[] = [];

    listProduct: any;

    totalCount: number;
    page: number = 1;
    pageSize: number = 10;
    total: number = 0;

    listChoosenProduct: any = [];

    isSellect = new Array(1000).fill(false);
    constructor(
        private dataService: DataService,
        private router: Router,
        public dialogRef: MatDialogRef<ProductListComponent>,
        private purchaseOrder: PurchaseOrderService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}

    ngOnInit(): void {
        this.subscription.push(
            this.purchaseOrder.productPage.subscribe((data) => {
                this.page = data;
            }),
        );
        this.listChoosenProduct = this.data;
        // this.getAllProducts();
    }

    ngAfterViewInit(): void {
        // this.subscription.push(
        //     this.purchaseOrder.searchListProduct().subscribe((data) => {
        //         this.listProduct = data.data;
        //         this.total = data.total;
        //     }),
        // );
        this.getAllProducts();
    }

    ngOnDestroy(): void {
        this.subscription.forEach((service) => {
            service.unsubscribe();
        });
    }
    stopPropagation(e: any) {
        e.stopPropagation();
    }
    save() {
        this.dialogRef.close(this.listChoosenProduct);
    }
    choose(product: any, i: number) {
        this.isSellect[i] = true;
        this.listChoosenProduct.push(product);
    }
    unChoose(productRemove: any, i: number) {
        this.isSellect[i] = false;
        this.listChoosenProduct = this.listChoosenProduct.filter((product: any) => {
            return product != productRemove;
        });
    }
    close() {
        this.dialogRef.close([]);
    }
    getAllProducts() {
        this.purchaseOrder
            .getAllProduct({
                sortBy: {
                    property: 'createdDate',
                    value: true,
                },
                page: 1,
                pageSize: 1000,
            })
            .subscribe((data) => {
                this.listProduct = data.data;
                this.total = data.totalCount;
                this.getChoosedProduct();
            });
    }

    getChoosedProduct() {
        console.log(this.listChoosenProduct);
        this.listProduct.forEach((product: any) => {
            if (Array.prototype.includes.call(this.listChoosenProduct, product)) {
                product.isChoosen = true;
            } else {
                product.isChoosen = false;
            }
        });
        console.log(this.listProduct);
    }
}
