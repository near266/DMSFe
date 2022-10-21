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
    groupIdSearched: any;
    listAllRoute: any = [];
    listGroup: any = [];
    listPromotionProductAdd: any = [];

    listProductToSentAPI: any = [];
    genOrderForm: FormGroup;
    listChoosenProductPromotion: any = [];
    listChoosenProduct: any = [];
    listPromotionProduct: any = [];
    listWarehouse: any = [];
    listProductPromotionRemove: any = [];
    listProductAdd: any = [];

    totalAmount: number = 0;
    totalDiscountProduct: number = 0;
    tradeDiscount: number = 0;
    totalPayment: number = 0;
    prePayment: number = 0;
    textMoney: any;
    isRemove = false;

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
            debtRecord: [false],
            paymentTerm: [null],
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
            this.listCustomer = data?.data;
        });
        // get list route
        this.getAllRoute();

        // get list group
        this.purchaseOrder.getAllGroup(1).subscribe((data) => {
            this.listGroup = data;
        });
        // get list wareHouse
        this.getListWareHouse();
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

    getListWareHouse() {
        this.purchaseOrder.getAllWarehouses().subscribe((data) => {
            this.listWarehouse = data;
        });
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
        if (product.totalPrice) {
            product.discountRate = ((product.discount * 100) / product.totalPrice).toFixed(1);
        }
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
        if (customerId) {
            this.purchaseOrder.getRouteByCustomerId(customerId).subscribe((data) => {
                this.routeIdSearched = data.route?.id;
                // get employee in route
                this.genOrderForm.patchValue({
                    orderEmployeeId: data.route?.employee?.id,
                });
                // get group by customerID
                this.groupIdSearched = data.route?.unitTreeGroup?.id;
                this.genOrderForm.patchValue({
                    groupId: this.groupIdSearched,
                });
            });
            // get customer ID and patch Value
            this.purchaseOrder.getCustomerById(customerId).subscribe((data) => {
                this.genOrderForm.patchValue({
                    customerName: data.customerCode,
                    phone: data.phone,
                    address: data.address,
                });
                console.log(data.id);
            });
        }
    }

    countTotalPayment() {
        this.totalPayment = 0;
        if (this.totalAmount) {
            this.totalPayment = this.totalAmount - this.tradeDiscount - this.totalDiscountProduct;
        }
    }

    patchValue() {
        this.pushListProductToDialog();
        this.pushListProductPromotionToDialog();
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

        // get list product
        this.listProduct = this.relatedOrder.listProduct;
        // get list promotion product
        this.listPromotionProduct = this.relatedOrder.listPromotionProduct;
        // loop to map warehouseId
        this.listProduct.forEach((product: any) => {
            product.warehouseId = product.warehouse?.id;
        });
        this.listPromotionProduct.forEach((product: any) => {
            product.warehouseId = product.warehouse?.id;
        });
    }

    countDiscount(product: any) {
        if (product.totalPrice) {
            product.discount = (product.discountRate / 100) * product.totalPrice;
        }
    }

    setWareHouseToAllProductPromotion(value: any) {
        if (value != 0) {
            this.listPromotionProduct.forEach((product: any) => {
                product.warehouseId = value;
            });
            this.listPromotionProductAdd.forEach((product: any) => {
                product.warehouseId = value;
            });
        }
    }

    stopPropagation(e: any) {
        e.stopPropagation();
    }

    // format form add product to view Detail
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
                    warehouseId: product?.warehouse?.id,
                    unitPrice: product.retailPrice, // mặc định đơn giá là giá lẻ
                    quantity: 0,
                    totalPrice: 0,
                    discount: 0,
                    discountRate: 0,
                    note: null,
                    type: 1,
                };
            });
            return List;
        }
    }

    // loop to reduce available product
    listAddProduct(list: any) {
        let listAddProduct = [];
        console.log(this.listProduct.length, list.length);
        if (list && this.listProduct) {
            let listAvailbleIds = this.listProduct.map((product: any) => {
                return product?.product?.id;
            });
            listAddProduct = list.filter((product: any) => {
                return !listAvailbleIds.includes(product.product.id);
            });
        }
        return listAddProduct;
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

    formatProductToSentAPI(list: any) {
        let listProductToSentAPI = list.map((product: any) => {
            return {
                productId: product.product?.id,
                unitId: product.unitId,
                warehouseId: product.warehouseId,
                unitPrice: product.unitPrice,
                quantity: product.quantity,
                totalPrice: product.totalPrice,
                discount: product.discount,
                discountRate: product.discountRate,
                note: product.note,
                type: product.type,
            };
        });
        return listProductToSentAPI;
    }

    createSaleReceipt() {
        // let listProductToSentAPI = this.listProduct.map((product: any) => {
        //     return {
        //         productId: product.product.id,
        //         unitId: product.unit.id,
        //         warehouseId: product.warehouse.id,
        //         unitPrice: product.unitPrice,
        //         quantity: product.quantity,
        //         totalPrice: product.totalPrice,
        //         discount: product.discount,
        //         discountRate: product.discountRate * 100,
        //         note: product.note,
        //         type: product.type,
        //     };
        // });
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
            createdDate: moment(Date.now()).format('YYYY-MM-DDTHH:mm:ss'),
            // saleReceiptCode: this.genOrderForm.get('saleEmployee')?.value.employeeCode,
            purchaseOrderId: this.relatedOrder.id,
            deliveryDate: moment(this.genOrderForm.get('deliveryDate')?.value).format('YYYY-MM-DD'),
            saleDate: moment(this.genOrderForm.get('saleDate')?.value).format('YYYY-MM-DD'),
            paymentTerm: moment(this.genOrderForm.get('paymentTerm')?.value).format('YYYY-MM-DD'),
            prePayment: this.prePayment,
            listProduct: this.formatProductToSentAPI(this.listProduct),
            listPromotionProduct: this.formatProductToSentAPI(this.listPromotionProduct),
            debtRecord: this.genOrderForm.get('debtRecord')?.value,
        };
        this.saleReceipt.create(body).subscribe(
            (data) => {},
            (err) => {
                this.snackbar.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'bottom', false);
            },
            () => {
                this.updateStatus();
                // this.snackbar.openSnackbar('Thêm mới đơn bán hàng thành công', 2000, 'Đóng', 'center', 'bottom', true);
                // this.dialogRef.close();
                // this.router.navigate(['/orders']);
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

    pushListProductToDialog() {
        this.listChoosenProduct = this.relatedOrder.listProduct.map((product: any) => {
            return {
                id: product.product.id,
            };
        });
    }

    pushListProductPromotionToDialog() {
        this.listChoosenProductPromotion = this.relatedOrder.listPromotionProduct.map((product: any) => {
            return {
                id: product.product.id,
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
            data: {
                listId: this.listChoosenProduct,
                listProd: this.relatedOrder.listProduct,
            },
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (!data.isCancel) {
                if (this.formatFormProduct(data)) {
                    let listAdd = this.listAddProduct(this.formatFormProduct(data));
                    listAdd.forEach((product: any) => {
                        this.listProduct.push(product);
                    });
                    this.pushListProductToDialog();
                }
            }
        });
    }

    openDialogProductPromotion() {
        console.log(this.listChoosenProductPromotion);
        const dialogRef = this.dialog.open(ProductListComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            panelClass: 'full-screen-modal',
            data: {
                listId: this.listChoosenProductPromotion,
                listProd: this.relatedOrder.listPromotionProduct,
            },
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (!data.isCancel) {
                if (this.formatFormProductPromotion(data)) {
                    let listAdd = this.listAddProductPromotion(this.formatFormProductPromotion(data));
                    listAdd.forEach((product: any) => {
                        this.listPromotionProduct.push(product);
                    });
                    this.pushListProductPromotionToDialog();
                }
            }
        });
    }

    // format form add product Promotion to view Detail
    formatFormProductPromotion(data: any) {
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
                    warehouseId: product?.warehouse?.id,
                    unitPrice: product.retailPrice, // mặc định đơn giá là giá lẻ
                    quantity: 0,
                    totalPrice: 0,
                    discount: 0,
                    discountRate: 0,
                    note: null,
                    type: 2,
                };
            });
            return List;
        }
    }

    // loop to reduce available product promotion
    listAddProductPromotion(list: any) {
        let listAddProduct = [];
        if (list && this.listPromotionProduct) {
            let listAvailbleIds = this.listPromotionProduct.map((product: any) => {
                return product?.product?.id;
            });
            listAddProduct = list.filter((product: any) => {
                return !listAvailbleIds.includes(product.product.id);
            });
        }
        return listAddProduct;
    }

    unChoosePromotion(productRemove: any) {
        // remove to list product
        this.listPromotionProduct = this.listPromotionProduct.filter((product: any) => {
            return productRemove.product.id != product?.product?.id;
        });
        this.pushListProductPromotionToDialog();
    }

    unChoose(productRemove: any) {
        // remove to list product
        this.listProduct = this.listProduct.filter((product: any) => {
            return productRemove.product.id != product?.product?.id;
        });
        this.pushListProductToDialog();
    }
}
