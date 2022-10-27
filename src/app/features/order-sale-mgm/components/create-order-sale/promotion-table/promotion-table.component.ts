import { Component, OnChanges, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { ProductListComponent } from 'src/app/features/orders-mgm/components/product-list/product-list.component';
import { FormatService } from '../../../services/format.service';

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
    constructor(
        private dialog: MatDialog,
        private formatService: FormatService,
        private purchaseOrder: PurchaseOrderService,
    ) {}

    ngOnInit(): void {}

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
        this.listPromotionProductAdd = this.listPromotionProductAdd.filter((product: any) => {
            return productRemove.product.id != product?.product?.id;
        });
        this.pushListProductPromotionToDialog();
    }

    searchListProductActive(e: any) {
        const body = {
            keyword: e.target.value,
            sortBy: {
                property: 'CreatedDate',
                value: true,
            },
            page: 1,
            pageSize: 5,
        };
        this.purchaseOrder.getListProductActived(body).subscribe((data) => {
            console.log(data);
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

    addProductPromotionBySearch(product: any) {
        let productAfterFormat = this.formatService.formatProductPromotionFromCloseDialogAdd([product], []);
        this.listPromotionProductAdd.push(productAfterFormat[0]);
        this.pushListProductPromotionToDialog();
    }
}
