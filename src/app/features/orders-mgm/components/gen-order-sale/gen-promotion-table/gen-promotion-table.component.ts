import { Component, OnInit, Input, Output, EventEmitter, OnChanges, DoCheck, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { FormatService } from '../../../services/format.service';
import { ProductListComponent } from '../../product-list/product-list.component';

@Component({
    selector: 'app-gen-promotion-table',
    templateUrl: './gen-promotion-table.component.html',
    styleUrls: ['./gen-promotion-table.component.scss'],
})
export class GenPromotionTableComponent implements OnInit, OnChanges, DoCheck {
    @Input() listPromotionProduct: any = [];
    @Input() listWarehouse: any = [];
    @Output() listPromotionProduct$ = new EventEmitter<any>();
    productPromotionFilterCtrl: FormControl = new FormControl();
    listSearchedProduct: any = [];
    listChoosenProductPromotion: any = [];
    constructor(
        private purchaseOrder: PurchaseOrderService,
        private dialog: MatDialog,
        private format: FormatService,
    ) {}

    ngOnInit(): void {
        this.productPromotionFilterCtrl.valueChanges.subscribe((data) => this.searchListProductActive(data));
    }

    ngDoCheck(): void {
        this.listPromotionProduct$.emit(this.listPromotionProduct);
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.listPromotionProduct = this.format.formatUnitIdAndWareHouseId(this.listPromotionProduct);
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

    openDialogProductPromotion() {
        this.pushListProductPromotionToDialog();
        const dialogRef = this.dialog.open(ProductListComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            panelClass: 'full-screen-modal',
            data: {
                listId: this.listChoosenProductPromotion,
                // listProd: this.relatedOrder.listPromotionProduct,
            },
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (!data.isCancel) {
                let listAdd = this.format.formatProductPromotionFromCloseDialogAdd(data, this.listPromotionProduct);
                listAdd.forEach((product: any) => {
                    this.listPromotionProduct.push(product);
                });
                this.pushListProductPromotionToDialog();
            }
        });
    }

    pushListProductPromotionToDialog() {
        this.listChoosenProductPromotion = this.listPromotionProduct.map((product: any) => {
            return {
                id: product.product.id,
            };
        });
    }

    setWareHouseToAllProductPromotion(value: any) {
        if (value != 0) {
            this.listPromotionProduct.forEach((product: any) => {
                product.warehouseId = value;
            });
        }
    }

    addProductPromotionBySearch(product: any, e: any) {
        if (e.source.selected) {
            let productAfterFormat = this.format.formatProductPromotionFromCloseDialogAdd([product], []);
            this.listPromotionProduct.push(productAfterFormat[0]);
            this.pushListProductPromotionToDialog();
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

    unChoosePromotion(productRemove: any) {
        let indexOf = this.listPromotionProduct.indexOf(productRemove);
        // remove to list product
        // this.listPromotionProduct = this.listPromotionProduct.filter((product: any) => {
        //     return productRemove.product.id != product?.product?.id;
        // });
        this.listPromotionProduct.splice(indexOf, 1);
        this.pushListProductPromotionToDialog();
    }
}
