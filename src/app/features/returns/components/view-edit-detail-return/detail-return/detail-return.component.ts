import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ListProduct, ListPromotionProduct } from 'src/app/core/model/PurchaseOrder';
import { DataService } from 'src/app/core/services/data.service';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { ProductListComponent } from 'src/app/features/orders-mgm/components/product-list/product-list.component';
import { Subscription } from 'rxjs';
import { SaleReceiptService } from 'src/app/core/services/saleReceipt.service';
import { statusList } from 'src/app/core/data/PurchaseOrderList';
import { ReturnDetailsService } from '../../../services/return-details.service';
import { readMoney } from 'src/app/core/shared/utils/readMoney';
import { ComponentMode } from '../../../models/componentMode';

@Component({
    selector: 'app-detail-return',
    templateUrl: './detail-return.component.html',
    styleUrls: ['./detail-return.component.scss'],
})
export class DetailReturnComponent implements OnInit {
    statusList = statusList;
    statusNow!: number;
    ComponentModeList = ComponentMode;
    detailOrderForm!: FormGroup;
    currentMode: ComponentMode;
    totalPrice: number;
    textMoney: string;
    discountAmount: number;
    subscription: Subscription[] = [];
    id: string;
    constructor(private returnDetailsService: ReturnDetailsService) {}

    ngOnInit(): void {
        this.returnDetailsService.currentMode$.subscribe((mode) => {
            this.currentMode = mode;
        });
        // pass id to service
        this.returnDetailsService.totalPrice$.subscribe((data) => {
            this.totalPrice = data;
            const ins = new readMoney(data);
            this.textMoney = ins.doc(data - this.discountAmount);
        });
        this.returnDetailsService.discountAmount$.subscribe((data) => {
            this.discountAmount = data;
            const ins = new readMoney(data);
            this.textMoney = ins.doc(this.totalPrice - data);
        });
    }

    ngOnDestroy(): void {
        this.subscription.forEach((service) => {
            service.unsubscribe();
        });
    }

    ngAfterViewInit(): void {}

    ngDoCheck(): void {}

    stopPropagation(e: any) {
        e.stopPropagation();
    }

    // openDialogProduct() {
    //     const dialogRef = this.dialog.open(ProductListComponent, {
    //         maxWidth: '100vw',
    //         maxHeight: '100vh',
    //         height: '100%',
    //         width: '100%',
    //         panelClass: 'full-screen-modal',
    //         data: {
    //             listId: this.returnDetailsService.returnListProducts$.getValue().map((product) => {
    //                 return { id: product.product?.id };
    //             }),
    //         },
    //     });
    //     dialogRef.afterClosed().subscribe((data) => {
    //         if (!data.isCancel) {
    //             console.log(data);
    //             console.log(this.formatFormProduct(data));
    //             console.log(this.returnDetailsService.returnListProducts$.getValue());
    //             // this.listChoosenProduct = data;
    //             // this.listProduct = this.listChoosenProduct;
    //             if (this.formatFormProduct(data)) {
    //                 const result = this.formatFormProduct(data);
    //                 //push items in result to current returnListProducts
    //                 this.returnDetailsService.returnListProducts$.next([
    //                     ...this.returnDetailsService.returnListProducts$.getValue(),
    //                     ...result,
    //                 ]);
    //             }
    //         }
    //     });
    // }

    formatFormProduct(data: any) {
        if (data.length > 0) {
            let List = data.map((product: any) => {
                return {
                    product: {
                        id: product.id,
                        sku: product.sku,
                        productName: product.productName,
                        retailPrice: product.retailPrice,
                        price: product.price,
                        vat: product.vat,
                        warehouseId: product?.warehouse?.id,
                        retailUnit: product.retailUnit,
                        wholeSaleUnit: product.wholeSaleUnit,
                    },
                    unit: {
                        id: product?.retailUnit?.id, // mặc định chọn đvt lẻ
                        unitCode: product?.retailUnit?.unitCode,
                        unitName: product?.retailUnit?.unitName,
                    },
                    warehouse: {
                        id: product?.warehouse?.id || null,
                        warehouseCode: product?.warehouse?.warehouseCode || null,
                        warehouseName: product?.warehouse?.warehouseName || null,
                    },
                    unitPrice: product.retailPrice, // mặc định đơn giá là giá lẻ
                    quantity: 0,
                    totalPrice: 0,
                    discount: 0,
                    discountRate: 0,
                    note: null,
                    type: 1,
                };
            });
            const existedIds = this.returnDetailsService.returnListProducts$.getValue().map((product) => {
                return product.product?.id;
            });
            List = List.filter((product: any) => {
                return !existedIds.includes(product.product?.id);
            });

            return List;
        } else {
            return false;
        }
    }
}
