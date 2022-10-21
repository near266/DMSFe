import { Component, Inject, OnInit, AfterViewInit, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Route, Router } from '@angular/router';
import { info } from 'console';
import * as moment from 'moment';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { SaleReceiptService } from 'src/app/core/services/saleReceipt.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { NumberToTextService } from 'src/app/core/shared/services/number-to-text.service';
import { ProductListComponent } from '../product-list/product-list.component';

@Component({
    selector: 'app-gen-order-sale',
    templateUrl: './gen-order-sale.component.html',
    styleUrls: ['./gen-order-sale.component.scss'],
})
export class GenOrderSaleComponent implements OnInit, AfterViewInit, DoCheck {
    statusList = ['Chờ duyệt', 'Đã duyệt', 'Đã giao hàng'];
    groupCites = ['Hà Nội', 'TP Hồ Chí Minh', 'Đà Nẵng'];
    listEmployee: any = [];
    listEmployee1: any = [];
    listEmployee2: any = [];
    listCustomer: any = [];
    relatedOrder: any = [];
    listProduct: any = [];
    listCustomerSearched: any = [];
    listRouteSearched: any;
    routeIdSearched: any;
    listAllRoute: any = [];
    listGroup: any = [];

    listProductToSentAPI: any = [];
    genOrderForm: FormGroup;

    totalAmount: number = 0;
    totalDiscountProduct: number = 0;
    tradeDiscount: number = 0;
    totalPayment: number = 0;
    prePayment: number = 0;
    textMoney: any;

    pageRoute: number;
    pageRouteSize: number;
    saleDefaultId: string;
    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<GenOrderSaleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private purchaseOrder: PurchaseOrderService,
        private fb: FormBuilder,
        private saleReceipt: SaleReceiptService,
        private snackbar: SnackbarService,
        private router: Router,
        private numberToText: NumberToTextService,
    ) {}

    ngOnInit(): void {
        // parse token to get id login
        this.saleDefaultId = this.parseJwt(localStorage.getItem('access_token')).sid;
        this.genOrderForm = this.fb.group({
            orderDate: [null],
            saleDate: [null],
            deliveryDate: [null],
            groupId: [null],
            orderEmployeeId: [null],
            routeId: [null],
            saleEmployeeId: [this.saleDefaultId],
            customerId: [null],
            customerName: [null],
            phone: [null],
            address: [null],
            description: [null],
        });
        this.relatedOrder = this.data.detailOrder;
        this.listProduct = this.relatedOrder.listProduct;
        this.patchValue();
        // get all info payment
        console.log(this.relatedOrder);
        this.totalAmount = this.relatedOrder.totalAmount;
        this.totalDiscountProduct = this.relatedOrder.totalDiscountProduct;
        this.tradeDiscount = this.relatedOrder.tradeDiscount;
        this.totalPayment = this.relatedOrder.totalPayment;
        this.prePayment = this.relatedOrder.prePayment;
        this.textMoney = this.numberToText.doc(this.totalPayment);
    }

    ngAfterViewInit(): void {
        // get list employee
        this.purchaseOrder.getAllEmployees('', 1, 1000).subscribe((data) => {
            this.listEmployee = data.data;
            this.listEmployee1 = this.listEmployee;
            this.listEmployee2 = this.listEmployee;
        });
        // get list customer
        this.purchaseOrder.searchCustomer({ keyword: '', page: 1, pageSize: 1000 }).subscribe((data) => {
            this.listCustomer = data.data;
        });
        // get list route
        this.getAllRoute();

        // get list grouo
        this.purchaseOrder.getAllGroup(1).subscribe((data) => {
            this.listGroup = data;
        });
    }

    ngDoCheck(): void {
        // count totalAmount (Tổng tiền hàng)
        this.countTotalAmount();
        // count totalDiscountProduct (Chiết khấu sản phẩm)
        this.countTotalDiscountProduct();
        // count totalPayment
        this.countTotalPayment();
        // number to text
        this.textMoney = this.numberToText.doc(this.totalPayment);

        // this.getRouteByCustomerId(this.genOrderForm.get('customerId')?.value);
    }

    parseJwt(token: any) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(
            window
                .atob(base64)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join(''),
        );
        return JSON.parse(jsonPayload);
    }

    discountRate(product: any) {
        product.discountRate = product.discount / product.totalPrice;
    }

    countTotalAmount() {
        this.totalAmount = 0;
        this.listProduct.forEach((product: any) => {
            if (product.totalPrice) {
                this.totalAmount += product.totalPrice;
            }
        });
    }

    countTotalDiscountProduct() {
        this.totalDiscountProduct = 0;
        this.listProduct.forEach((product: any) => {
            if (product.discount) {
                this.totalDiscountProduct += product.discount;
            }
        });
    }

    getAllRoute() {
        this.purchaseOrder.getAllRoute(1, 1000).subscribe((data) => {
            this.listAllRoute = data.data;
        });
    }

    getRouteByCustomerId(customerId: any) {
        this.routeIdSearched = null;
        // get route ID
        this.purchaseOrder.getRouteByCustomerId(customerId).subscribe((data) => {
            this.routeIdSearched = data.routeId;
            // get employee in route
            this.genOrderForm.patchValue({
                orderEmployeeId: data.route.employeeId,
            });
            console.log(this.routeIdSearched);
        });
    }

    countTotalPayment() {
        this.totalPayment = 0;
        if (this.totalAmount) {
            this.totalPayment = this.totalAmount - this.tradeDiscount;
        }
    }

    patchValue() {
        let description;
        if (this.relatedOrder.description) {
            description = `Bán hàng theo phiếu đặt hàng số [${this.relatedOrder.orderCode}]`;
        } else {
            description = `${this.relatedOrder.description} - Bán hàng theo phiếu đặt hàng số [${this.relatedOrder.orderCode}]`;
        }
        this.genOrderForm.patchValue({
            orderDate: this.relatedOrder.orderDate,
            deliveryDate: this.relatedOrder.deliveryDate,
            orderEmployeeId: this.relatedOrder.orderEmployee?.id,
            // groupId: [null],
            // routeId: [null],
            customerId: this.relatedOrder.customer?.id,
            customerName: this.relatedOrder.customerName,
            phone: this.relatedOrder.phone,
            address: this.relatedOrder.address,
            description: description,
        });
    }

    stopPropagation(e: any) {
        e.stopPropagation();
    }

    openDialogProduct() {
        const dialogRef = this.dialog.open(ProductListComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            panelClass: 'full-screen-modal',
        });
    }

    searchListCustomer(e: any) {
        let body = {
            keyword: e.target.value,
            page: 1,
            pageSize: 100,
        };
        this.purchaseOrder.searchCustomer(body).subscribe((data) => {
            this.listCustomerSearched = data.data;
        });
    }

    searchListEmployee1(e: any) {
        this.purchaseOrder.getAllEmployees(e.target.value, 1, 1000).subscribe((data) => {
            this.listEmployee1 = data.data;
        });
    }

    searchListEmployee2(e: any) {
        this.purchaseOrder.getAllEmployees(e.target.value, 1, 1000).subscribe((data) => {
            this.listEmployee2 = data.data;
        });
    }

    createSaleReceipt() {
        let listProductToSentAPI = this.listProduct.map((product: any) => {
            return {
                productId: product.product.id,
                unitId: product.unit.id,
                warehouseId: product.warehouse.id,
                unitPrice: product.unitPrice,
                quantity: product.quantity,
                totalPrice: product.totalPrice,
                discount: product.discount,
                discountRate: product.discountRate * 100,
                note: product.note,
                type: product.type,
            };
        });
        const body = {
            orderDate: moment(this.genOrderForm.get('orderDate')?.value).format('YYYY-MM-DD'),
            groupId: 'ef6c9edf-5445-4dbf-b0f3-d65d6412cfc0',
            saleEmployeeId: this.genOrderForm.get('saleEmployeeId')?.value.id,
            // warehouseId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            customerId: this.genOrderForm.get('customerId')?.value,
            // routeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            orderEmployeeId: this.genOrderForm.get('orderEmployeeId')?.value,
            type: 0,
            status: 3,
            paymentMethod: 0,
            description: this.genOrderForm.get('description')?.value,
            phone: this.genOrderForm.get('phone')?.value,
            address: this.genOrderForm.get('address')?.value,
            customerName: this.genOrderForm.get('customerName')?.value,
            totalAmount: this.totalAmount,
            totalOfVAT: 0,
            totalDiscountProduct: this.totalDiscountProduct,
            tradeDiscount: this.tradeDiscount,
            totalPayment: this.totalPayment,
            archived: false,
            // createdBy: 'string',
            createdDate: moment(Date.now()).format('YYYY-MM-DD'),
            // saleReceiptCode: this.genOrderForm.get('saleEmployee')?.value.employeeCode,
            purchaseOrderId: this.relatedOrder.id,
            deliveryDate: moment(this.genOrderForm.get('deliveryDate')?.value).format('YYYY-MM-DD'),
            saleDate: moment(this.genOrderForm.get('saleDate')?.value).format('YYYY-MM-DD'),
            paymentTerm: '2022-10-16T05:26:34.266Z',
            prePayment: this.prePayment,
            debtRecord: true,
            listProduct: listProductToSentAPI,
        };
        this.saleReceipt.create(body).subscribe(
            (data) => {},
            (err) => {
                this.snackbar.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'bottom', false);
            },
            () => {
                // this.updateStatus();
                this.snackbar.openSnackbar('Thêm mới đơn bán hàng thành công', 2000, 'Đóng', 'center', 'bottom', true);
                this.dialogRef.close();
                this.router.navigate(['/orders']);
            },
        );
    }

    updateStatus() {
        const body = {
            purchaseOrderId: this.relatedOrder.id,
            orderDate: this.relatedOrder.orderDate,
            groupId: this.relatedOrder.unit?.id,
            orderEmployeeId: this.relatedOrder.orderEmployee?.id,
            warehouseId: this.relatedOrder.warehouse?.id,
            customerId: this.relatedOrder.customer?.id,
            routeId: this.relatedOrder.route?.id,
            type: this.relatedOrder.type,
            status: 3,
            paymentMethod: 0,
            description: this.relatedOrder.description,
            phone: this.relatedOrder.phone,
            address: this.relatedOrder.address,
            customerName: this.relatedOrder.customerName,
            totalAmount: this.relatedOrder.totalAmount,
            totalOfVAT: this.relatedOrder.totalOfVAT,
            totalDiscountProduct: this.relatedOrder.totalDiscountProduct,
            tradeDiscount: this.relatedOrder.tradeDiscount,
            totalPayment: this.relatedOrder.totalPayment,
            archived: false,
            // lastModifiedBy: 'string',
            lastModifiedDate: moment(Date.now()).format('YYYY-MM-DD'),
            orderCode: this.relatedOrder.orderCode,
            deliveryDate: this.relatedOrder.deliveryDate,
            prePayment: this.relatedOrder.prePayment,
        };
        this.purchaseOrder.update(body).subscribe(
            (data) => {},
            (err) => {},
            () => {
                this.snackbar.openSnackbar('Thêm mới đơn bán hàng thành công', 2000, 'Đóng', 'center', 'bottom', true);
                this.dialogRef.close();
                this.router.navigate(['/orders']);
            },
        );
    }
}
