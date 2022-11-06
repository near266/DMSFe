import { AfterViewInit, Component, DoCheck, OnInit, OnDestroy } from '@angular/core';
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
import * as moment from 'moment';
import { NumberToTextService } from 'src/app/core/shared/services/number-to-text.service';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, DoCheck, AfterViewInit, OnDestroy {
    statusList = statusList;
    statusNow!: number;
    type: string = 'View';
    detailOrderForm!: FormGroup;
    detailOrder: any = [];
    id: string;
    subscription: Subscription[] = [];
    isRemove = false;
    roleMain = 'member';

    listProduct: any = [];
    listPromotionProduct: any = [];
    listEmployee: any = [];
    listCustomer: any = [];
    listProductAdd: any = [];
    listProductRemove: any = [];

    totalAmount: number = 0;
    totalDiscountProduct: number = 0;
    tradeDiscount: number = 0;
    totalPayment: number = 0;
    prePayment: number = 0;
    totalOfVAT: number = 0;
    textMoney: any;
    debtLimit: any;
    defaultCustomer: any;
    defaultOrderEmployee: any;

    listChoosenProduct: any = [];
    listWarehouse: any = [];
    listRoute: any = [];
    listGroup: any = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private dataservice: DataService,
        private dialog: MatDialog,
        private saleReceipt: SaleReceiptService,
        private purchaseOrder: PurchaseOrderService,
        private numberToText: NumberToTextService,
    ) {}

    ngOnInit(): void {
        this.roleMain = localStorage.getItem('roleMain')!;
        // get id
        this.id = localStorage.getItem('receiptOrderId')!;
        // create Form
        this.detailOrderForm = this.fb.group({
            saleReceiptCode: [null],
            orderDate: [null],
            saleDate: [null],
            saleEmployee: [null],
            deliveryDate: [null],
            groupId: [null],
            orderEmployee: [null],
            routeId: [null],
            customer: this.fb.group({
                code: [null],
                name: [null],
                phone: [null],
                address: [null],
            }),
            description: [null],
            debtLimit: [null],
            debtCurrent: [null],
            paymentMethod: [null],
            totalAmount: [null],
            totalOfVAT: [null],
            totalDiscountProduct: [null],
            tradeDiscount: [null],
            totalPayment: [null],
            prePayment: [null],
            status: [null],
            paymentTerm: [null],
            debtRecord: [false],
        });
        // get type (Edit or View) from parent Component
        this.subscription.push(
            this.dataservice.type.subscribe((data: any) => {
                this.type = data;
            }),
        );
        // get isChangeStatus
        this.saleReceipt.msg.subscribe((data) => {
            if (data === 'Done') {
                this.getDetail();
            }
        });
        // xem update thành công chưa -> nếu thành công reload lại data
        this.saleReceipt.isSucessUpdate.subscribe((data) => {
            if (data === 'Done') {
                this.getDetail();
                // nếu update thành công -> list AddProduct  = []
                this.listProductAdd = [];
            }
        });
    }

    textMoneyGen(money: any) {
        this.textMoney = this.numberToText.doc(money);
    }

    ngOnDestroy(): void {
        this.subscription.forEach((service) => {
            service.unsubscribe();
        });
    }

    ngAfterViewInit(): void {
        this.getDetail();
        // this.getListCustomer();
        this.getListEmployee();
        this.getListWareHouse();
        this.getListGroup();
        this.getListRoute();
    }

    ngDoCheck(): void {
        this.saleReceipt.sendBodyUpdate({
            id: this.detailOrder.id,
            orderDate: moment(this.detailOrderForm.get('orderDate')?.value).format('YYYY-MM-DD'),
            groupId: this.detailOrderForm.get('groupId')?.value,
            saleCode: this.detailOrder.saleCode,
            saleEmployeeId: this.detailOrderForm.get('saleEmployee')?.value,
            orderEmployeeId: this.detailOrderForm.get('orderEmployee')?.value,
            warehouseId: this.detailOrder.warehouse?.id,
            customerId: this.detailOrderForm.get('customer.code')?.value,
            routeId: this.detailOrderForm.get('routeId')?.value,
            type: this.detailOrder.type,
            status: this.detailOrderForm.get('status')?.value,
            paymentMethod: 0,
            description: this.detailOrderForm.get('description')?.value,
            phone: this.detailOrderForm.get('customer.phone')?.value,
            address: this.detailOrderForm.get('customer.address')?.value,
            customerName: this.detailOrderForm.get('customer.name')?.value,
            purchaseOrderId: this.detailOrder?.purchaseOrder?.id, // ?
            deliveryDate: moment(this.detailOrderForm.get('deliveryDate')?.value).format('YYYY-MM-DD'),
            saleDate: moment(this.detailOrderForm.get('saleDate')?.value).format('YYYY-MM-DD'),
            paymentTerm: moment(this.detailOrderForm.get('paymentTerm')?.value).format('YYYY-MM-DD'),
            totalAmount: this.totalAmount,
            totalOfVAT: this.totalOfVAT,
            totalDiscountProduct: this.totalDiscountProduct,
            tradeDiscount: this.tradeDiscount,
            totalPayment: this.totalPayment,
            prePayment: this.prePayment,
            debtRecord: this.detailOrderForm.get('debtRecord')?.value,
        });
        // count totalAmount (Tổng tiền hàng)
        this.countTotalAmount();
        // count totalDiscountProduct (Chiết khấu sản phẩm)
        this.countTotalDiscountProduct();
        // count totalPayment
        this.countTotalPayment();
        // number to text
        this.textMoney = this.numberToText.doc(this.totalPayment);
    }

    countTotalAmount() {
        this.totalAmount = 0;
        let tt1 = 0;
        let tt2 = 0;
        // list sản phẩm có sẵn (update)
        this.getProductListUpdate().forEach((product: any) => {
            if (product.totalPrice) {
                tt1 += product.totalPrice;
            }
        });
        // list sản phẩm thêm vào
        this.listProductAdd.forEach((product: any) => {
            if (product.totalPrice) {
                tt2 += product.totalPrice;
            }
        });
        this.totalAmount = tt1 + tt2;
    }

    countTotalDiscountProduct() {
        this.totalDiscountProduct = 0;
        let tt1 = 0;
        let tt2 = 0;
        // list sản phẩm có sẵn (update)
        this.getProductListUpdate().forEach((product: any) => {
            if (product.discount) {
                tt1 += product.discount;
            }
        });
        // list sản phẩm thêm vào
        this.listProductAdd.forEach((product: any) => {
            if (product.discount) {
                tt2 += product.discount;
            }
        });
        this.totalDiscountProduct = tt1 + tt2;
    }

    countTotalPayment() {
        this.totalPayment = 0;
        if (this.totalAmount) {
            this.totalPayment = this.totalAmount - this.tradeDiscount - this.totalDiscountProduct;
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

    getDetail() {
        this.saleReceipt.searchReceiptById(this.id).subscribe((data) => {
            this.detailOrder = data;
            // lấy ra default customer (trước khi patch value)
            this.defaultCustomer = this.detailOrder?.customer;
            // lấy ra default employee
            this.defaultOrderEmployee = this.detailOrder?.orderEmployee;
            this.patchValue();
            this.pushListProductToDialog();
            // get all info payment
            this.totalAmount = this.detailOrder.totalAmount;
            this.totalDiscountProduct = this.detailOrder.totalDiscountProduct;
            this.tradeDiscount = this.detailOrder.tradeDiscount;
            this.totalPayment = this.detailOrder.totalPayment;
            this.prePayment = this.detailOrder.prePayment;
            this.textMoney = this.numberToText.doc(this.totalPayment);
            // set hạn mức dư nợ
            if (this.detailOrder?.customer?.id) {
                this.purchaseOrder.getCustomerById(this.detailOrder?.customer?.id).subscribe((data) => {
                    this.debtLimit = data?.debtLimit;
                });
            }
        });
    }

    searchListCustomer(e: any) {
        let body = {
            keyword: e.target.value,
            page: 1,
            pageSize: 30,
        };
        // phải filter ra thằng customer đã có sẵn
        this.purchaseOrder.searchCustomer(body).subscribe((data) => {
            this.listCustomer = data.data?.filter((customer: any) => {
                return customer?.id != this.defaultCustomer?.id;
            });
        });
    }

    searchListEmployee(e: any) {
        this.purchaseOrder.getAllEmployees(e.target.value, 1, 30).subscribe((data) => {
            this.listEmployee = data.data;
        });
    }

    patchValue() {
        this.detailOrderForm.patchValue({
            saleReceiptCode: this.detailOrder.saleCode,
            orderDate: this.detailOrder.orderDate,
            saleDate: this.detailOrder.saleDate,
            deliveryDate: this.detailOrder.deliveryDate,
            groupId: this.detailOrder.group?.id,
            orderEmployee: this.detailOrder.orderEmployee?.id,
            saleEmployee: this.detailOrder.saleEmployee?.id,
            routeId: this.detailOrder.route?.id,
            customer: {
                code: this.detailOrder.customer?.id,
                phone: this.detailOrder.phone,
                address: this.detailOrder.address,
                name: this.detailOrder.customerName,
            },
            description: this.detailOrder.description,
            status: this.detailOrder.status,
            paymentTerm: this.detailOrder.paymentTerm,
            debtRecord: this.detailOrder.debtRecord,
        });
        this.listProduct = this.detailOrder.listProduct;
        this.listPromotionProduct = this.detailOrder.listPromotionProduct;
        // loop to map warehouseId
        // this.listProduct.forEach((product: any) => {
        //     product.warehouseId = product.warehouse?.id;
        // });
        // this.listPromotionProduct.forEach((product: any) => {
        //     product.warehouseId = product.warehouse?.id;
        // });
    }

    getListCustomer() {
        this.purchaseOrder.searchCustomer({ keyword: '', page: 1, pageSize: 1000 }).subscribe((data: any) => {
            this.listCustomer = data.data;
        });
    }

    setInfoCustomer(id: string) {
        let customer = this.listCustomer.filter((customer: any) => {
            return customer.id === id;
        })[0];
        this.detailOrderForm.patchValue({
            customer: {
                name: [null],
                phone: [null],
                address: [null],
            },
        });
        this.detailOrderForm.patchValue({
            customer: {
                name: customer.customerName,
                phone: customer.phone,
                address: customer.address,
            },
        });
        // set hạn mức dư nợ
        this.purchaseOrder.getCustomerById(id).subscribe((data) => {
            this.debtLimit = data?.debtLimit;
        });
    }

    setRouteGroupAndEmployee(customerId: any) {
        this.purchaseOrder.getRouteByCustomerId(customerId).subscribe((data) => {
            if (data) {
                this.detailOrderForm.patchValue({
                    routeId: data.route?.id,
                    groupId: data.route?.unitTreeGroup?.id,
                    orderEmployee: data.route?.employee?.id,
                });
            }
        });
    }

    getListEmployee() {
        this.purchaseOrder.getAllEmployees('', 1, 1000).subscribe((data) => {
            this.listEmployee = data.data;
        });
    }

    getListWareHouse() {
        this.subscription.push(
            this.purchaseOrder.getAllWarehouses().subscribe((data) => {
                this.listWarehouse = data;
            }),
        );
    }

    getListRoute() {
        this.purchaseOrder.getAllRoute(1, 1000, '').subscribe((data) => (this.listRoute = data.data));
    }

    getListGroup() {
        this.purchaseOrder.getAllGroup(1).subscribe((data) => {
            this.listGroup = data;
        });
    }

    getProductListUpdate() {
        // console.log(this.listProduct);
        let listProductToSent = this.listProduct.map((product: any) => {
            return {
                saleRecieptId: this.id,
                productId: product?.product?.id,
                // productName: product.product.productName,
                unitId: product.unit.id,
                warehouseId: product.warehouseId,
                unitPrice: product.unitPrice,
                quantity: product.quantity,
                totalPrice: product.totalPrice,
                discount: product.discount || 0,
                discountRate: product.discountRate || 0,
                note: product.note,
                type: product.type,
            };
        });
        return listProductToSent;
    }

    stopPropagation(e: any) {
        e.stopPropagation();
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

    // unChooseFromListAdd(productRemove: any) {
    //     // remove from list add
    //     this.listProductAdd = this.listProductAdd.filter((product: any) => {
    //         return productRemove.product.id != product?.product?.id;
    //     });
    // }

    pushListProductToDialog() {
        this.listChoosenProduct = this.detailOrder.listProduct.map((product: any) => {
            return {
                id: product.product.id,
            };
        });
    }

    // openDialogProduct() {
    //     const dialogRef = this.dialog.open(ProductListComponent, {
    //         maxWidth: '100vw',
    //         maxHeight: '100vh',
    //         height: '100%',
    //         width: '100%',
    //         panelClass: 'full-screen-modal',
    //         data: {
    //             listId: this.listChoosenProduct,
    //             listProd: this.detailOrder.listProduct,
    //         },
    //     });
    //     dialogRef.afterClosed().subscribe((data) => {
    //         if (!data.isCancel) {
    //             // this.listChoosenProduct = data;
    //             // this.listProduct = this.listChoosenProduct;
    //             if (this.formatFormProduct(data)) {
    //                 let listAdd = this.listAddProduct(this.formatFormProduct(data));
    //                 this.listProductAdd = [];
    //                 this.listProductAdd = listAdd;
    //                 console.log(listAdd);
    //                 // listAdd.forEach((product: any) => {
    //                 //     this.listProduct.push(product);
    //                 // });
    //             }
    //         }
    //     });
    // }

    // format form add product to view Detail
    // formatFormProduct(data: any) {
    //     if (data.length > 0) {
    //         let List = data.map((product: any) => {
    //             return {
    //                 product: {
    //                     id: product.id,
    //                     sku: product.sku,
    //                     productName: product.productName,
    //                     retailPrice: product.retailPrice,
    //                     price: product.price,
    //                     vat: product.vat,
    //                     warehouseId: product?.warehouse?.id,
    //                     retailUnit: product.retailUnit,
    //                     wholeSaleUnit: product.wholeSaleUnit,
    //                 },
    //                 unit: {
    //                     id: product?.retailUnit?.id, // mặc định chọn đvt lẻ
    //                     unitCode: product?.retailUnit?.unitCode,
    //                     unitName: product?.retailUnit?.unitName,
    //                 },
    //                 warehouseId: product?.warehouse?.id,
    //                 unitPrice: product.retailPrice, // mặc định đơn giá là giá lẻ
    //                 quantity: 0,
    //                 totalPrice: 0,
    //                 discount: 0,
    //                 discountRate: 0,
    //                 note: null,
    //                 type: 1,
    //             };
    //         });
    //         return List;
    //     }
    // }

    // loop to reduce available product
    // listAddProduct(list: any) {
    //     let listAddProduct = [];
    //     console.log(this.listProduct.length, list.length);
    //     if (list && this.listProduct) {
    //         let listAvailbleIds = this.listProduct.map((product: any) => {
    //             return product?.product?.id;
    //         });
    //         listAddProduct = list.filter((product: any) => {
    //             return !listAvailbleIds.includes(product.product.id);
    //         });
    //     }
    //     return listAddProduct;
    // }
}
