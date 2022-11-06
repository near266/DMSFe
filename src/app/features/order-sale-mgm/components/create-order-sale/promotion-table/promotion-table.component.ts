import { Component, OnChanges, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { ProductListComponent } from 'src/app/features/orders-mgm/components/product-list/product-list.component';
import { FormatService } from '../../../services/format.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
    selector: 'sale-create-promotion-table',
    templateUrl: './promotion-table.component.html',
    styleUrls: ['./promotion-table.component.scss'],
})
export class PromotionTableComponent implements OnInit, OnChanges {
    @Input() listWarehouse: any;
    @Output() listPromotionProductAdd$ = new EventEmitter<[]>();
    listChoosenProductPromotion: any = [];
    listPromotionProductAdd: any = [];
    listSearchedProduct: any = [];
    productFilterCtrl: FormControl = new FormControl();
    constructor(
        private dialog: MatDialog,
        private formatService: FormatService,
        private purchaseOrder: PurchaseOrderService,
        private snackbar: SnackbarService,
    ) {}

    ngOnInit(): void {
        // create search product form
        this.productFilterCtrl.valueChanges.subscribe((data) => this.searchListProductActive(data));
    }

    ngOnChanges(changes: SimpleChanges): void {
        // console.log(changes);
    }

    ngDoCheck(): void {
        if (this.listPromotionProductAdd.length > 0) {
            this.listPromotionProductAdd$.emit(
                this.formatService.formatProductPromotionAddToSentApi(this.listPromotionProductAdd),
            );
        }
    }

    openDialogProductPromotion() {
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
                this.listPromotionProductAdd = this.formatService.formatProductPromotionFromCloseDialogAdd(data, []);
                this.pushListProductPromotionToDialog();
            }
        });
    }

    setWareHouseToAllProductPromotion(value: any) {
        if (value != 0) {
            this.listPromotionProductAdd.forEach((product: any) => {
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

    stopPropagation(e: any) {
        e.stopPropagation();
    }

    unChoosePromotion(productRemove: any) {
        // remove to list product
        // this.listPromotionProductAdd = this.listPromotionProductAdd.filter((product: any) => {
        //     return productRemove.product.id != product?.product?.id;
        // });
        let indexOf = this.listPromotionProductAdd.indexOf(productRemove);
        this.listPromotionProductAdd.splice(indexOf, 1);
        this.pushListProductPromotionToDialog();
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
            this.listSearchedProduct = data?.data;
        });
    }

    pushListProductPromotionToDialog() {
        this.listChoosenProductPromotion = this.listPromotionProductAdd.map((product: any) => {
            return {
                id: product.product.id,
            };
        });
    }

    addProductPromotionBySearch(product: any, e: any) {
        if (e.source.selected) {
            // let isSelected = false;
            // if (this.listPromotionIds.includes(product.id)) {
            //     isSelected = true;
            // } else {
            //     isSelected = false;
            // }
            // if (!isSelected) {
            //     let productAfterFormat = this.formatService.formatProductPromotionFromCloseDialogAdd([product], []);
            //     this.listPromotionProductAdd.push(productAfterFormat[0]);
            //     this.pushListProductPromotionToDialog();
            // } else {
            //     this.snackbar.openSnackbar('Sản phẩm đã có trong đơn', 2000, 'Đóng', 'center', 'bottom', false);
            // }
            let productAfterFormat = this.formatService.formatProductPromotionFromCloseDialogAdd([product], []);
            this.listPromotionProductAdd.push(productAfterFormat[0]);
            this.pushListProductPromotionToDialog();
        }
    }
}
