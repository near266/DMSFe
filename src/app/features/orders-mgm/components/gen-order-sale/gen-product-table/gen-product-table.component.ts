import { Component, OnInit, Input, Output, EventEmitter, DoCheck, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { FormatService } from '../../../services/format.service';
import { ProductListComponent } from '../../product-list/product-list.component';

@Component({
    selector: 'app-gen-product-table',
    templateUrl: './gen-product-table.component.html',
    styleUrls: ['./gen-product-table.component.scss'],
})
export class GenProductTableComponent implements OnInit, DoCheck, OnChanges {
    @Input() listProduct: any = [];
    @Input() listWarehouse: any = [];
    @Output() listProduct$ = new EventEmitter<any>();

    productFilterCtrl: FormControl = new FormControl();
    listSearchedProduct: any = [];
    listChoosenProduct: any = [];
    constructor(
        private purchaseOrder: PurchaseOrderService,
        private format: FormatService,
        private dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.productFilterCtrl.valueChanges.subscribe((data) => this.searchListProductActive(data));
    }

    ngDoCheck(): void {
        this.listProduct$.emit(this.listProduct);
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.listProduct = this.format.formatUnitIdAndWareHouseId(this.listProduct);
    }

    searchListProductActive(value: any) {
        const body = {
            keyword: value,
            sortBy: {
                property: 'CreatedDate',
                value: true,
            },
            page: 1,
            pageSize: 3,
        };
        this.purchaseOrder.getListProductActived(body).subscribe((data) => {
            console.log(data);
            this.listSearchedProduct = data?.data;
        });
    }

    addProductBySearch(product: any, e: any) {
        if (e.source.selected) {
            product = this.format.formatProductFromCloseDialogAdd([product], []);
            this.listProduct.push(product[0]);
            this.pushListProductToDialog();
        }
    }

    pushListProductToDialog() {
        this.listChoosenProduct = this.listProduct.map((product: any) => {
            return {
                id: product.product.id,
            };
        });
    }

    openDialogProduct() {
        this.pushListProductToDialog();
        const dialogRef = this.dialog.open(ProductListComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            panelClass: 'full-screen-modal',
            data: {
                listId: this.listChoosenProduct,
                // listProd: this.relatedOrder.listProduct,
            },
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (!data.isCancel) {
                let listAdd = this.format.formatProductFromCloseDialogAdd(data, this.listProduct);
                listAdd.forEach((product: any) => {
                    this.listProduct.push(product);
                });
                this.pushListProductToDialog();
            }
        });
    }

    setWareHouseToAllProduct(value: any) {
        if (value != 0) {
            this.listProduct.forEach((product: any) => {
                product.warehouseId = value;
            });
        }
    }

    selectUnit(product: any, type: any) {
        if (type === 'retail') {
            product.unitId = product?.product?.retailUnit?.id;
            product.unitPrice = product.product.retailPrice;
        } else if (type == 'whosale') {
            product.unitId = product?.product?.wholeSaleUnit?.id;
            product.unitPrice = product.product.price;
        }
        product.totalPrice = product.quantity * product.unitPrice;
        this.discountRate(product);
    }

    discountRate(product: any) {
        if (product.totalPrice) {
            product.discountRate = ((product.discount * 100) / product.totalPrice).toFixed(1);
        }
    }

    countDiscount(product: any) {
        if (product.totalPrice) {
            product.discount = (product.discountRate / 100) * product.totalPrice;
        }
    }

    stopPropagation(e: any) {
        e.stopPropagation();
    }

    unChoose(productRemove: any) {
        let indexOf = this.listProduct.indexOf(productRemove);
        // remove to list product
        // this.listProduct = this.listProduct.filter((product: any) => {
        //     return productRemove.product.id != product?.product?.id;
        // });
        this.listProduct.splice(indexOf, 1);
        this.pushListProductToDialog();
    }
}
