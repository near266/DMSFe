import {
    Component,
    OnInit,
    Input,
    DoCheck,
    AfterViewInit,
    OnChanges,
    SimpleChanges,
    EventEmitter,
    Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { SaleReceiptService } from 'src/app/core/services/saleReceipt.service';
import { NumberToTextService } from 'src/app/core/shared/services/number-to-text.service';
import { ProductListComponent } from 'src/app/features/orders-mgm/components/product-list/product-list.component';
import { FormatService } from '../../services/format.service';

@Component({
    selector: 'app-product-table',
    templateUrl: './product-table.component.html',
    styleUrls: ['./product-table.component.scss'],
})
export class ProductTableComponent implements OnInit, DoCheck, AfterViewInit, OnChanges {
    @Input() listProduct: any = [];
    @Input() listWarehouse: any = [];
    @Input() saleReceiptId: any = [];
    // @Output() totalAmount$ = new EventEmitter<any>();
    // @Output() totalDiscountProduct$ = new EventEmitter<any>();
    // @Output() totalPayment$ = new EventEmitter<any>();

    @Output() listProduct$ = new EventEmitter<any>();
    @Output() listProductAdd$ = new EventEmitter<any>();

    type: string = 'View';
    subscription: Subscription[] = [];
    listProductAdd: any = [];
    listChoosenProductIds: any = [];
    listProductRemove: any = [];

    totalAmount: number = 0;
    totalDiscountProduct: number = 0;
    tradeDiscount: number = 0;
    totalPayment: number = 0;
    prePayment: number = 0;
    totalOfVAT: number = 0;

    constructor(
        private dataservice: DataService,
        private dialog: MatDialog,
        private formatService: FormatService,
        private saleReceipt: SaleReceiptService,
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
                // nếu update thành công -> list AddProduct  = []
                this.listProductAdd = [];
            }
        });
    }

    ngAfterViewInit(): void {}

    ngDoCheck(): void {
        // send body update product
        this.sendBodyUpdateProduct();
        // send list product add
        this.sendListProductAdd();
        this.listProduct$.emit(this.listProduct);
        this.listProductAdd$.emit(this.listProductAdd);
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.listProduct = this.formatService.formatUnitIdAndWareHouseId(this.listProduct);
    }

    sendBodyUpdateProduct() {
        this.saleReceipt.sendProductUpdate(
            this.formatService.formatProductToSendAPI(this.listProduct, this.saleReceiptId),
        );
    }

    sendListProductAdd() {
        this.saleReceipt.sendProductAdd(
            this.formatService.formatProductAddToSendAPI(this.listProductAdd, this.saleReceiptId, 1),
        );
    }

    pushListProductToDialog() {
        this.listChoosenProductIds = this.listProduct.map((product: any) => {
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
                listId: this.listChoosenProductIds,
                listProd: this.listProduct,
            },
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (!data.isCancel) {
                this.listProductAdd = this.formatService.formatProductFromCloseDialogAdd(data, this.listProduct);
            }
        });
    }

    setWareHouseToAllProduct(value: any) {
        if (value != 0) {
            this.listProduct.forEach((product: any) => {
                product.warehouseId = value;
            });
            this.listProductAdd.forEach((product: any) => {
                product.warehouseId = value;
            });
        }
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

    updateTotalPrice(product: any) {
        product.totalPrice = product.quantity * product.unitPrice;
        this.discountRate(product);
    }

    stopPropagation(e: any) {
        e.stopPropagation();
    }

    unChoose(productRemove: any) {
        // send to service
        this.listProductRemove.push({
            productId: productRemove?.product?.id,
            type: productRemove.type,
            unitId: productRemove.unitId,
            warehouseId: productRemove.warehouseId,
        });
        this.saleReceipt.sendProductRemove({
            isRemove: true,
            list: this.listProductRemove,
        });
        // remove to list product
        this.listProduct = this.listProduct.filter((product: any) => {
            return productRemove.product.id != product?.product?.id;
        });
    }

    unChooseFromListAdd(productRemove: any) {
        // remove from list add
        this.listProductAdd = this.listProductAdd.filter((product: any) => {
            return productRemove.product.id != product?.product?.id;
        });
    }

    selectUnit(product: any, type: any) {
        if (type === 'retail') {
            product.unitId = product?.product?.retailUnit?.id;
            product.unitPrice = product.product.retailPrice;
            product.totalPrice = product.quantity * product.unitPrice;
        } else if ((type = 'whosale')) {
            product.unitId = product?.product?.wholeSaleUnit?.id;
            product.unitPrice = product.product.price;
            product.totalPrice = product.quantity * product.unitPrice;
        }
        this.discountRate(product);
    }
}
