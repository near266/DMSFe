import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    DoCheck,
    OnDestroy,
} from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounce, debounceTime, Observable, Subscription } from 'rxjs';
import { Warehouse } from 'src/app/core/model/Warehousers';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { ProductListComponent } from 'src/app/features/orders-mgm/components/product-list/product-list.component';
import { Product } from '../../models/product';
import { CommonLogicService } from '../../services/commonLogic.service';
import { PurchaseLogicService } from '../../services/purchaseLogic.service';
import { Payment } from '../template-footer-order/template-footer-order.component';
import { SaleLogicService } from '../../services/saleLogic.service';
import { WareHouse } from '../../models/warehouse';

@Component({
    selector: 'app-template-table-product',
    templateUrl: './template-table-product.component.html',
    styleUrls: ['./template-table-product.component.scss'],
})
export class TemplateTableProductComponent implements OnInit, AfterViewInit, OnChanges, DoCheck, OnDestroy {
    @Input() id: string;
    @Input() orderType: string = '';
    @Input() typeTable: string = ''; // Product / Promotion
    @Input() type: string = ''; // Create / Detail
    @Input() title: string = ''; // Sản phẩm đặt hàng / Sản phẩm khuyến mại
    @Input() list: any = []; // truyền vào khi type = 'Detail'
    @Input() payment: Payment = new Payment();
    @Output() listUpdate$ = new EventEmitter<{
        data: any;
        isUpdate: boolean;
    }>();
    @Output() listRemove$ = new EventEmitter<{
        data: any;
        isRemove: boolean;
    }>();
    @Output() listAdd$ = new EventEmitter<{
        data: any;
        isAdd: boolean;
    }>();
    @Output() listCreate$ = new EventEmitter<any>();

    private subscriptions: Subscription = new Subscription();

    @AutoUnsubscribe()
    isEdit$: Observable<boolean> = this.commonLogicService.isEdit$;
    @AutoUnsubscribe()
    listProductActive$: Observable<Product[]> = this.commonLogicService.listProductActive$;

    productFilterCtrl: FormControl = new FormControl();
    listWarehouse: WareHouse[];
    listAdd: any = [];
    listRemove: any = [];
    listChoosenIds: { id: string }[] = [];

    constructor(
        private purchaseService: PurchaseOrderService,
        private commonLogicService: CommonLogicService,
        private dialog: MatDialog,
        private purchaseLogicService: PurchaseLogicService,
        private saleLogicService: SaleLogicService,
    ) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.productFilterCtrl.valueChanges.pipe(debounceTime(300)).subscribe((keyword) => {
                if (keyword != '') {
                    this.getListProductActived(keyword);
                }
            }),
        );
        this.subscriptions.add(
            this.commonLogicService.isSave$.subscribe((data) => {
                if (data) {
                    this.save();
                }
            }),
        );
        this.subscriptions.add(
            this.commonLogicService.isSucess$.subscribe((data) => {
                if (data) {
                    this.listAdd = [];
                    this.listRemove = [];
                }
            }),
        );
        this.subscriptions.add(
            this.commonLogicService.isCreate$.subscribe((data) => {
                if (data) {
                    this.create();
                }
            }),
        );
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.getListWareHouse();
        }, 0);
    }

    ngOnChanges(changes: SimpleChanges): void {}

    ngDoCheck(): void {
        if (this.payment && this.typeTable === 'Product') {
            this.updatePayment();
        }
        if (this.type === 'Create') {
            this.create();
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    create() {
        this.listCreate$.emit(this.listAdd);
    }

    countTotalAmount() {
        this.payment.totalAmount = 0;
        let tt1 = 0;
        let tt2 = 0;
        // list available prod
        this.list.forEach((product: any) => {
            if (product.totalPrice) {
                tt1 += product.totalPrice;
            }
        });
        // list add prod
        this.listAdd.forEach((product: any) => {
            if (product.totalPrice) {
                tt2 += product.totalPrice;
            }
        });
        this.payment.totalAmount = tt1 + tt2;
    }

    countTotalDiscountProduct() {
        this.payment.totalDiscountProduct = 0;
        let tt1 = 0;
        let tt2 = 0;
        // list sản phẩm có sẵn (update)
        this.list.forEach((product: any) => {
            if (product.discount) {
                tt1 += product.discount;
            }
        });
        // list sản phẩm thêm vào
        this.listAdd.forEach((product: any) => {
            if (product.discount) {
                tt2 += product.discount;
            }
        });
        this.payment.totalDiscountProduct = tt1 + tt2;
    }

    countTotalPayment() {
        this.payment.totalPayment = 0;
        if (this.payment.totalAmount) {
            this.payment.totalPayment =
                this.payment.totalAmount - this.payment.tradeDiscount - this.payment.totalDiscountProduct;
        }
    }

    updatePayment() {
        // count totalAmount
        this.countTotalAmount();
        // count totalDiscountProduct
        this.countTotalDiscountProduct();
        // count totalPayment
        this.countTotalPayment();
        if (this.orderType === 'Purchase') {
            if (this.type === 'Detail') {
                this.purchaseLogicService.setPaymentSource(this.payment);
            }
            if (this.type === 'Create') {
                this.purchaseLogicService.setPaymentCreateSource(this.payment);
            }
        } else if (this.orderType === 'Sale') {
            if (this.type === 'Detail') {
                this.saleLogicService.setPaymentSource(this.payment);
            }
            if (this.type === 'Create') {
                this.saleLogicService.setPaymentCreateSource(this.payment);
            }
        }
    }

    getListWareHouse() {
        this.subscriptions.add(
            this.purchaseService.getAllWarehouses().subscribe((data) => {
                if (data) {
                    this.listWarehouse = data;
                }
            }),
        );
    }

    getListProductActived(keyword: any) {
        this.commonLogicService.searchListProductActived(keyword);
    }

    openDialogProduct() {
        this.pushListChoosenToDialog();
        const dialogRef = this.dialog.open(ProductListComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            panelClass: 'full-screen-modal',
            data: {
                listId: this.listChoosenIds,
            },
        });
        this.subscriptions.add(
            dialogRef.afterClosed().subscribe((data) => {
                if (!data.isCancel) {
                    this.listAdd = this.commonLogicService.formatProductFromCloseDialogAdd(data, this.list);
                }
            }),
        );
    }

    pushListChoosenToDialog() {
        this.list.forEach((product: any) => {
            this.listChoosenIds.push({
                id: product.product.id,
            });
        });
        this.listAdd.forEach((product: any) => {
            this.listChoosenIds.push({
                id: product.product.id,
            });
        });
    }

    setWareHouseToAllProduct(e: any) {
        this.list.forEach((product: any) => {
            product.warehouseId = e;
        });
        this.listAdd.forEach((product: any) => {
            product.warehouseId = e;
        });
    }

    addProductBySearch(product: any, e: any) {
        if (e.source.selected) {
            product = this.commonLogicService.formatProductFromCloseDialogAdd([product], []);
            this.listAdd.push(product[0]);
        }
    }

    stopPropagation(e: any) {
        e.stopPropagation();
    }

    // Bỏ chọn từ list sản phẩm
    unChoose(productRemove: any) {
        let indexOf = this.list.indexOf(productRemove);
        this.list.splice(indexOf, 1);
        this.listRemove.push(productRemove);
    }

    // Bỏ chọn từ list add
    unChooseFromListAdd(productRemove: any) {
        let indexOf = this.listAdd.indexOf(productRemove);
        this.listAdd.splice(indexOf, 1);
    }

    save() {
        let isAdd: boolean = false;
        let isRemove: boolean = false;
        if (this.listAdd.length > 0) {
            isAdd = true;
        }
        if (this.listRemove.length > 0) {
            isRemove = true;
        }
        if (this.orderType === 'Purchase') {
            this.purchaseLogicService.updateList(
                this.commonLogicService.formatListToSendAPI(this.list, this.orderType, this.typeTable, this.id),
                {
                    data: this.commonLogicService.formatListtAddToSendAPI(
                        this.listAdd,
                        this.orderType,
                        this.typeTable === 'Product' ? 1 : 2,
                        this.id,
                    ),
                    isAdd: isAdd,
                },
                {
                    data: this.listRemove,
                    isRemove: isRemove,
                },
                this.id,
            );
        } else if (this.orderType === 'Sale') {
            this.saleLogicService.updateList(
                this.commonLogicService.formatListToSendAPI(this.list, this.orderType, this.typeTable, this.id),
                {
                    data: this.commonLogicService.formatListtAddToSendAPI(
                        this.listAdd,
                        this.orderType,
                        this.typeTable === 'Product' ? 1 : 2,
                        this.id,
                    ),
                    isAdd: isAdd,
                },
                {
                    data: this.listRemove,
                    isRemove: isRemove,
                },
                this.id,
            );
        }
    }

    emitListUpdate() {
        this.listUpdate$.emit({
            data: '',
            isUpdate: false,
        });
        this.listUpdate$.emit({
            data: this.commonLogicService.getBodyUpdateProduct(this.id, this.orderType, this.typeTable, this.list),
            isUpdate: true,
        });
    }

    emitListAdd() {
        if (this.listAdd.lenght > 0) {
            this.listAdd$.emit({
                data: this.commonLogicService.getBodyAddProduct(this.id, this.orderType, this.typeTable, this.listAdd),
                isAdd: true,
            });
        }
    }

    emitListRemove() {}

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

    discountRate(product: any) {
        if (product.totalPrice) {
            product.discountRate = ((product.discount * 100) / product.totalPrice).toFixed(1);
        }
    }

    updateTotalPrice(product: any) {
        product.totalPrice = product.quantity * product.unitPrice;
        this.countDiscount(product);
    }

    countDiscount(product: any) {
        if (product.totalPrice) {
            product.discount = (product.discountRate / 100) * product.totalPrice;
        }
    }
}
