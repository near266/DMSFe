import { AfterViewInit, Component, DoCheck, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { SaleReceiptService } from 'src/app/core/services/saleReceipt.service';
import { ProductListComponent } from 'src/app/features/orders-mgm/components/product-list/product-list.component';
import { FormatService } from '../../../services/format.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ifStmt } from '@angular/compiler/src/output/output_ast';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AreaService } from 'src/app/core/services/area.service';

@Component({
    selector: 'app-product-promotion-table',
    templateUrl: './product-promotion-table.component.html',
    styleUrls: ['./product-promotion-table.component.scss'],
})
export class ProductPromotionTableComponent implements OnInit, AfterViewInit, DoCheck, OnChanges {
    @Input() listPromotionProduct: any = [];
    @Input() listWarehouse: any = [];
    @Input() saleReceiptId: any = [];

    type: string = 'View';
    subscription: Subscription[] = [];
    listProductPromotionAdd: any = [];
    listPromotionIds: any = [];
    listProductPromotionRemove: any = [];
    listSearchedProduct: any = [];
    productFilterCtrl: FormControl = new FormControl();

    constructor(
        private dataservice: DataService,
        private saleReceipt: SaleReceiptService,
        private formatService: FormatService,
        private dialog: MatDialog,
        private purchaseOrder: PurchaseOrderService,
        private snackbar: SnackbarService,
        private areaService: AreaService,
    ) {}

    ngOnInit(): void {
        // get type (Edit or View) from parent Component
        this.subscription.push(
            this.dataservice.type.subscribe((data: any) => {
                this.type = data;
            }),
        );
        // xem update thành công chưa -> nếu thành công reload lại data
        this.saleReceipt.isSucessUpdate.subscribe((data) => {
            if (data === 'Done') {
                // nếu update thành công -> listProductPromotionAdd  = []
                this.listProductPromotionAdd = [];
            }
        });
        // create search product form
        this.productFilterCtrl.valueChanges.subscribe((data) => this.searchListProductActive(data));
    }

    ngAfterViewInit(): void {}

    ngDoCheck(): void {
        // send list product Promotion add
        this.sendListProductPromotionAdd();
        // send body update product promotion
        this.sendBodyUpdateProductPromotion();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.listPromotionProduct = this.formatService.formatUnitIdAndWareHouseId(this.listPromotionProduct);
        console.log(this.listPromotionProduct);
        this.pushListProductPromotionToDialog();
    }

    sendListProductPromotionAdd() {
        this.saleReceipt.sendProductPromotionAdd(
            this.formatService.formatProductAddToSendAPI(this.listProductPromotionAdd, this.saleReceiptId, 2),
        );
    }

    sendBodyUpdateProductPromotion() {
        this.saleReceipt.sendProductPromotionUpdate(
            this.formatService.formatProductToSendAPI(this.listPromotionProduct, this.saleReceiptId),
        );
    }

    discountRate(product: any) {
        // vì là promotion nên sẽ set discountRate = 0;
        product.discountRate = 0;
    }

    stopPropagation(e: any) {
        e.stopPropagation();
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
                listId: this.listPromotionIds,
                // listProd: this.detailOrder.listPromotionProduct,
            },
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (!data.isCancel) {
                this.listProductPromotionAdd = this.formatService.formatProductPromotionFromCloseDialogAdd(
                    data,
                    this.listPromotionProduct,
                );
                console.log(this.listProductPromotionAdd);
                this.pushListProductPromotionToDialog();
                // if (this.formatFormProductPromotion(data)) {
                //     let listAdd = this.listAddProductPromotion(this.formatFormProductPromotion(data));
                //     this.listPromotionProductAdd = [];
                //     this.listPromotionProductAdd = listAdd;
                // }
            }
        });
    }

    pushListProductPromotionToDialog() {
        this.listPromotionIds = this.listPromotionProduct.map((product: any) => {
            return {
                id: product.product.id,
            };
        });
        this.listProductPromotionAdd.forEach((product: any) => {
            this.listPromotionIds.push({ id: product.product.id });
        });
    }

    selectUnit(product: any, type: any) {
        if (type === 'retail') {
            product.unitId = product?.product?.retailUnit?.id;
            product.unitPrice = product.product.retailPrice;
            product.totalPrice = 0;
        } else if ((type = 'whosale')) {
            product.unitId = product?.product?.wholeSaleUnit?.id;
            product.unitPrice = product.product.price;
            product.totalPrice = 0;
        }
        this.discountRate(product);
    }

    updateTotalPrice(product: any) {
        product.totalPrice = 0;
        this.discountRate(product);
    }

    unChooseFromListAdd(productRemove: any) {
        let indexOf = this.listProductPromotionAdd.indexOf(productRemove);
        // remove from list add
        // this.listProductPromotionAdd = this.listProductPromotionAdd.filter((product: any) => {
        //     return productRemove.product.id != product?.product?.id;
        // });
        this.listProductPromotionAdd.splice(indexOf, 1);
    }

    unChoose(productRemove: any) {
        // send to service
        let indexOf = this.listPromotionProduct.indexOf(productRemove);
        this.listProductPromotionRemove.push({
            index: productRemove.index,
        });
        this.saleReceipt.sendProductPromotionRemove({
            isRemove: true,
            list: this.listProductPromotionRemove,
        });
        this.listPromotionProduct.splice(indexOf, 1);
    }

    searchListProductActive(value: any) {
        const body = {
            keyword: value,
            sortBy: {
                property: 'CreatedDate',
                value: true,
            },
            page: 1,
            pageSize: 5,
        };
        this.purchaseOrder.getListProductActived(body).subscribe((data) => {
            this.listSearchedProduct = data?.data;
        });
    }

    addProductPromotionBySearch(product: any, e: any) {
        if (e.source.selected) {
            product = this.formatService.formatProductPromotionFromCloseDialogAdd([product], []);
            this.listProductPromotionAdd.push(product[0]);
            this.pushListProductPromotionToDialog();
        }
    }

    setWareHouseToAllProduct(value: any) {
        if (value != 0) {
            this.listPromotionProduct.forEach((product: any) => {
                product.warehouseId = value;
            });
            this.listProductPromotionAdd.forEach((product: any) => {
                product.warehouseId = value;
            });
        }
    }
}
