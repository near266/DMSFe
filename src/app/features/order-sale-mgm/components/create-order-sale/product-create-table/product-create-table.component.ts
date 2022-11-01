import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { ProductListComponent } from 'src/app/features/orders-mgm/components/product-list/product-list.component';
import { FormatService } from '../../../services/format.service';

@Component({
    selector: 'app-product-create-table',
    templateUrl: './product-create-table.component.html',
    styleUrls: ['./product-create-table.component.scss'],
})
export class ProductCreateTableComponent implements OnInit, AfterViewInit, DoCheck {
    @Input() listWarehouse: any;
    @Output() listProductAdd$ = new EventEmitter<[]>();
    productFilterCtrl: FormControl = new FormControl();

    listSearchedProduct: any[] = [];
    listChoosenProduct: any[] = [];
    listProductIds: any[] = [];

    constructor(
        private dialog: MatDialog,
        private formatService: FormatService,
        private purchaseOrder: PurchaseOrderService,
    ) {}

    ngOnInit(): void {
        // create search product form
        this.productFilterCtrl.valueChanges.subscribe((data) => this.searchListProductActived(data));
    }

    ngAfterViewInit(): void {}

    ngDoCheck(): void {
        if (this.listChoosenProduct.length > 0) {
            this.listProductAdd$.emit(this.formatService.formatProductAddToSentApi(this.listChoosenProduct));
        }
    }

    searchListProductActived(value: any) {
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

    openDialogProduct() {
        const dialogRef = this.dialog.open(ProductListComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            panelClass: 'full-screen-modal',
            // data: this.listChoosenProduct,
            data: {
                listId: this.listProductIds,
                listProd: this.listChoosenProduct,
            },
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (!data.isCancel) {
                // this.listChoosenProduct = data;
                // this.listChoosenProduct.forEach((product: any) => {
                //     product.warehouseId = product.warehouse?.id; // auto chọn kho mặc định
                //     product.unitId = product?.retailUnit?.id; // auto chọn đơn vị lẻ
                //     product.unitPrice = product?.retailPrice; // auto chọn giá lẻ
                // });
                this.listChoosenProduct = this.formatService.formatProductFromCloseDialogAdd(data, []);
                this.pushListProductToDialog();
            }
        });
    }

    pushListProductToDialog() {
        this.listProductIds = this.listChoosenProduct.map((product: any) => {
            return {
                id: product.product.id,
            };
        });
    }

    setWareHouseToAllProduct(id: any) {
        if (id != 0) {
            this.listChoosenProduct.forEach((product: any) => {
                product.warehouseId = id;
            });
        }
    }

    addProductBySearch(product: any, e: any) {
        if (e.source.selected) {
            let productFormat = this.formatService.formatProductFromCloseDialogAdd([product], []);
            // product.quantity = 0;
            // product.warehouseId = product.warehouse?.id; // auto chọn kho mặc định
            // product.unitId = product?.retailUnit?.id; // auto chọn đơn vị lẻ
            // product.unitPrice = product?.retailPrice; // auto chọn giá lẻ
            this.listChoosenProduct.push(productFormat[0]);
            this.pushListProductToDialog();
        }
    }

    selectUnit(product: any, type: any) {
        if (type === 'retail') {
            product.unitId = product?.product?.retailUnit?.id;
            product.unitPrice = product.product.retailPrice;
            product.totalPrice = product.quantity * product.unitPrice;
        } else if (type === 'whosale') {
            product.unitId = product?.product?.wholeSaleUnit?.id;
            product.unitPrice = product.product.price;
            product.totalPrice = product.quantity * product.unitPrice;
        }
        this.discountRate(product);
    }

    discountRate(product: any) {
        if (product.totalPrice) {
            product.discountRate = ((product.discount * 100) / product.totalPrice).toFixed(1);
        }
    }

    selectWareHouse(value: any, product: any) {
        product.warehouseId = value;
    }

    updateTotalPrice(product: any) {
        product.totalPrice = product.quantity * product.unitPrice;
        this.discountRate(product);
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
        this.listChoosenProduct = this.listChoosenProduct.filter((product: any) => {
            return product != productRemove;
        });
    }
}
