import { Component, OnInit, OnDestroy, AfterViewInit, DoCheck } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
    isSelectAll = false;
    subscription: Subscription[] = [];

    listProduct: any;

    totalCount: number;
    page: number = 1;
    pageSize: number = 10;
    total: number = 0;

    productChoose: any = [];
    listChoosenProduct: any = [];
    listDontChooseProduct: any = [];

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
        this.productChoose = this.data?.listId || [];

        this.getAllProducts();
    }

    ngDoCheck(): void {}

    ngAfterViewInit(): void {
        // this.subscription.push(
        //     this.purchaseOrder.searchListProduct().subscribe((data) => {
        //         this.listProduct = data.data;
        //         this.total = data.total;
        //     }),
        // );
        // this.getAllProducts();
        setTimeout(() => {
            // get listChoosenProduct
            if (this.listProduct) {
                this.listChoosenProduct = this.listProduct.filter((product: any) => {
                    return product.isChoose;
                });
            }
        }, 1000);
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
        // this.isSellect[i] = false;
        this.listChoosenProduct = this.listChoosenProduct.filter((product: any) => {
            return product != productRemove;
        });
    }

    close() {
        this.dialogRef.close({
            isCancel: true,
        });
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
                if (data) {
                    this.listProduct = data.data;
                }
                this.total = data?.totalCount;
                this.getChoosedProduct();
            });
    }

    getChoosedProduct() {
        if (this.listProduct && this.productChoose) {
            for (let i = 0; i < this.listProduct.length; i++) {
                for (let j = 0; j < this.productChoose.length; j++) {
                    if (this.listProduct[i].id === this.productChoose[j].id) {
                        this.listProduct[i].isChoose = true;
                    }
                }
            }
        }
    }

    // getDontChooseProduct() {
    //     this.listDontChooseProduct = this.listProduct.filter((product: any) => {
    //         return !this.productChoose.includes(product.id);
    //     });
    // }
}
