import { Component, OnInit, AfterViewInit, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DataService } from 'src/app/core/services/data.service';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ProductListComponent } from '../product-list/product-list.component';
import { CurrencyPipe } from '@angular/common';
import { NumberToTextService } from 'src/app/core/shared/services/number-to-text.service';
@Component({
    selector: 'app-create-purchase-order',
    templateUrl: './create-purchase-order.component.html',
    styleUrls: ['./create-purchase-order.component.scss'],
})
export class CreatePurchaseOrderComponent implements OnInit, AfterViewInit, DoCheck {
    statusList = [
        {
            value: 1,
            name: 'Chờ duyệt',
        },
        {
            value: 2,
            name: 'Đã duyệt',
        },
    ];
    listRoute: any = [];
    listGroup: any = [];
    createForm: FormGroup;
    unitPrices: any = [];
    quantities: any = [];
    discount: any = [];
    quantity: any = 0;

    listCustomer: any[] = [];
    listChoosenProduct: any[] = [];
    listEmployee: any[] = [];
    listWarehouse: any[] = [];
    listChoosenProduct2: any[] = [];
    listPromotionProductAdd: any = [];

    debtLimit: any;
    totalAmount: number = 0;
    totalDiscountProduct: number = 0;
    tradeDiscount: number = 0;
    totalPayment: number = 0;
    prePayment: number = 0;
    textMoney: any;
    value: any;
    formattedAmount: any = '0';
    defaultUnit = "{ unit: product.retailUnit, type: 'retail' }";
    orderDefaultId: string;
    constructor(
        private dataService: DataService,
        private dialog: MatDialog,
        private fb: FormBuilder,
        private purchaseOrder: PurchaseOrderService,
        private snackbar: SnackbarService,
        private router: Router,
        private numberToText: NumberToTextService,
    ) {}

    ngOnInit(): void {
        // parse token to get id login
        this.orderDefaultId = this.parseJwt(localStorage.getItem('access_token')).sid;
        this.createForm = this.fb.group({
            purchaseOrderId: [null],
            orderDate: [moment(Date.now()).format('YYYY-MM-DD')],
            groupId: [null],
            orderEmployeeId: [this.orderDefaultId],
            warehouseId: [null],
            customer: this.fb.group({
                customerCode: [null],
                customerId: [null],
                customerName: [null],
                phone: [null],
                address: [null],
            }),
            routeId: [null],
            type: [null],
            status: [1],
            paymentMethod: [null],
            description: [null],
            phone: [null],
            address: [null],
            customerName: [null],
            totalAmount: [null],
            totalOfVAT: [null],
            totalDiscountProduct: [null],
            tradeDiscount: [null],
            totalPayment: [null],
            archived: [null],
            createdBy: [null],
            createdDate: [null],
            orderCode: [null],
            deliveryDate: [moment(Date.now()).format('YYYY-MM-DD')],
            prePayment: [null],
        });
    }

    format(event: any) {
        event.target.value = Number(event.target.value).toLocaleString('en');
    }

    ngAfterViewInit(): void {
        // get list customer
        this.purchaseOrder.searchCustomer({ keyword: '', page: 1, pageSize: 1000 }).subscribe((data) => {
            this.listCustomer = data.data;
        });
        // get list employee
        this.purchaseOrder.getAllEmployees('', 1, 10000).subscribe((data) => {
            this.listEmployee = data.data;
        });
        // get list warehouse
        this.purchaseOrder.getAllWarehouses().subscribe((data) => {
            this.listWarehouse = data;
        });
        // get list route
        this.purchaseOrder.getAllRoute(1, 1000, '').subscribe((data) => {
            this.listRoute = data.data;
        });
        // get list group
        this.purchaseOrder.getAllGroup(1).subscribe((data) => (this.listGroup = data));
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

        // tính cho từng sản phẩm
        // this.countDiscount();
        // this.countTotalPrice();
        // this.countDiscountRate();
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

    countDiscount(product: any) {
        if (product.totalPrice) {
            product.discount = (product.discountRate / 100) * product.totalPrice;
        }
    }
    // Tính cho đơn hàng
    countTotal(product: any) {
        this.quantity += product.quantity;
    }

    countTotalAmount() {
        this.totalAmount = 0;
        Array.prototype.forEach.call(this.listChoosenProduct, (product) => {
            if (product.totalPrice) {
                this.totalAmount += product.totalPrice;
            }
        });
    }

    countTotalDiscountProduct() {
        this.totalDiscountProduct = 0;
        Array.prototype.forEach.call(this.listChoosenProduct, (product) => {
            if (product.discount) {
                this.totalDiscountProduct += product.discount;
            }
        });
    }

    countTotalPayment() {
        this.totalPayment = 0;
        if (this.totalAmount) {
            this.totalPayment = this.totalAmount - this.tradeDiscount - this.totalDiscountProduct;
        }
    }

    // tính cho từng sản phẩm
    discountRate(product: any) {
        if (product.totalPrice) {
            product.discountRate = ((product.discount * 100) / product.totalPrice).toFixed(1);
        }
    }

    stopPropagation(e: any) {
        e.stopPropagation();
    }

    passingDataFrom() {
        this.dataService.openProductList('create', 'Đây là tạo sản phẩm');
    }

    pushListProductToDialog() {
        this.listChoosenProduct2 = this.listChoosenProduct.map((product: any) => {
            return {
                id: product.id,
            };
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
                listId: this.listChoosenProduct2,
                listProd: this.listChoosenProduct,
            },
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (!data.isCancel) {
                this.listChoosenProduct = data;
                this.listChoosenProduct.forEach((product: any) => {
                    product.warehouseId = product.warehouse?.id; // auto chọn kho mặc định
                    product.unitId = product?.retailUnit?.id; // auto chọn đơn vị lẻ
                    product.unitPrice = product?.retailPrice; // auto chọn giá lẻ
                });
                this.pushListProductToDialog();
            }
        });
    }

    create() {
        let lastListChoosen = this.listChoosenProduct.map((product: any) => {
            return {
                productId: product.id,
                productName: product.productName,
                unitId: product.unitId,
                warehouseId: product.warehouseId,
                unitPrice: product.unitPrice,
                quantity: product.quantity,
                totalPrice: product.totalPrice,
                discount: product.discount | 0,
                discountRate: product.discountRate | 0,
                note: product.note,
                type: 0,
            };
        });
        const body = {
            orderDate: moment(this.createForm.get('orderDate')?.value).format('YYYY-MM-DDTHH:mm:ss'),
            groupId: this.createForm.get('groupId')?.value, // Chưa có api get
            orderEmployeeId: this.createForm.get('orderEmployeeId')?.value,
            // warehouseId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            customerId: this.createForm.get('customer.customerId')?.value,
            routeId: this.createForm.get('routeId')?.value, // Chưa có API
            type: 0,
            status: this.createForm.get('status')?.value,
            description: this.createForm.get('description')?.value,
            phone: this.createForm.get('customer.phone')?.value,
            address: this.createForm.get('customer.address')?.value,
            customerName: this.createForm.get('customer.customerName')?.value,
            archived: false,
            createdDate: moment(Date.now()).format('YYYY-MM-DDTHH:mm:ss'),
            deliveryDate: moment(this.createForm.get('deliveryDate')?.value).format('YYYY-MM-DD'),
            listProduct: lastListChoosen,
            listPromotionProduct: this.listPromotionProductAdd,
            paymentMethod: 0, // có 1 loại payment
            prePayment: this.prePayment,
            totalAmount: this.totalAmount,
            totalOfVAT: 0, // là trường gì?
            totalDiscountProduct: this.totalDiscountProduct,
            tradeDiscount: this.tradeDiscount,
            totalPayment: this.totalPayment,
            source: 'Web',
        };
        this.purchaseOrder.createOrder(body).subscribe(
            (data) => {},
            (err) => {
                this.snackbar.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'bottom', false);
            },
            () => {
                this.snackbar.openSnackbar('Tạo mới đơn đặt hàng thành công', 2000, 'Đóng', 'center', 'bottom', true);
                this.router.navigate(['/orders']);
            },
        );
    }

    updateTotalPrice(product: any) {
        this.countTotal(product);
        product.totalPrice = product.quantity * product.unitPrice;
    }

    setInfoCustomer(id: string) {
        let customer = this.listCustomer.filter((customer: any) => {
            return customer.id === id;
        })[0];
        this.createForm.patchValue({
            customer: {
                customerId: customer.id,
                customerName: [null],
                phone: [null],
                address: [null],
            },
        });
        this.createForm.patchValue({
            customer: {
                customerId: customer.id,
                customerName: customer.customerName,
                phone: customer.phone,
                address: customer.address,
            },
        });
        // set hạn mức dư nợ
        this.purchaseOrder.getCustomerById(id).subscribe((data) => {
            this.debtLimit = data?.debtLimit;
        });
    }

    unChoose(productRemove: any) {
        this.listChoosenProduct = this.listChoosenProduct.filter((product: any) => {
            return product != productRemove;
        });
        this.quantity -= productRemove.quantity;
    }

    selectUnit(product: any, type: any) {
        if (type === 'retail') {
            product.unitId = product?.retailUnit?.id;
            product.unitPrice = product?.retailPrice;
        } else if (type == 'whosale') {
            product.unitId = product?.wholeSaleUnit?.id;
            product.unitPrice = product.price;
        }
        product.totalPrice = product.quantity * product.unitPrice;
        this.discountRate(product);
    }

    selectWareHouse(value: any, product: any) {
        product.warehouseId = value;
    }

    setWareHouseToAllProduct(id: any) {
        if (id != 0) {
            this.listChoosenProduct.forEach((product: any) => {
                product.warehouseId = id;
            });
        }
    }

    searchListCustomer(e: any) {
        if (e != 0) {
            let body = {
                keyword: e.target.value,
                page: 1,
                pageSize: 100,
            };
            this.purchaseOrder.searchCustomer(body).subscribe((data) => {
                this.listCustomer = data.data;
            });
        }
    }

    searchListRoute(e: any) {
        this.purchaseOrder.getAllRoute(1, 1000, e.target.value).subscribe((data) => {
            if (data) {
                this.listRoute = data.data;
            }
        });
    }

    setRouteGroupAndEmployee(customerId: any) {
        this.purchaseOrder.getRouteByCustomerId(customerId).subscribe((data) => {
            if (data) {
                this.createForm.patchValue({
                    routeId: data?.route?.id,
                    groupId: data?.route?.unitTreeGroup?.id,
                    orderEmployeeId: data?.route?.employee?.id,
                });
            }
        });
    }

    setProductPromotionAdd(e: any) {
        this.listPromotionProductAdd = e;
    }
}
