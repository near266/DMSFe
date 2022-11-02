import { Component, Inject, OnInit, AfterViewInit, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Route, Router } from '@angular/router';
import { info } from 'console';
import * as moment from 'moment';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { SaleReceiptService } from 'src/app/core/services/saleReceipt.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { NumberToTextService } from 'src/app/core/shared/services/number-to-text.service';
import { FormatService } from '../../services/format.service';
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

    listProductToSentAPI: any = [];
    genOrderForm: FormGroup;
    listChoosenProductPromotion: any = [];
    listChoosenProduct: any = [];
    listPromotionProduct: any = [];
    listWarehouse: any = [];
    listProductPromotionRemove: any = [];
    listProductAdd: any = [];
    listSearchedProduct: any = [];
    listProductIds: any = [];
    listPromotionIds: any = [];

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
    debtLimit: any;
    defaultCustomer: any;
    productFilterCtrl: FormControl = new FormControl();
    productPromotionFilterCtrl: FormControl = new FormControl();
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
        private format: FormatService,
    ) {}

    ngOnInit(): void {
        // parse token to get id login
        this.relatedOrder = this.data.detailOrder;
        // lấy ra default customer (trước khi patch value)
        this.defaultCustomer = this.relatedOrder?.customer;
        this.saleDefaultId = this.parseJwt(localStorage.getItem('access_token')).sid;
        this.genOrderForm = this.fb.group({
            orderDate: [null],
            saleDate: [moment(Date.now()).format('YYYY-MM-DD')],
            deliveryDate: [null],
            groupId: [this.relatedOrder?.group?.id],
            orderEmployeeId: [this.relatedOrder?.orderEmployee?.id],
            routeId: [this.relatedOrder?.route?.id],
            saleEmployeeId: [this.saleDefaultId],
            customerId: [null],
            customerName: [null],
            phone: [this.relatedOrder?.phone],
            address: [this.relatedOrder?.address],
            description: [null],
            debtRecord: [false],
            paymentTerm: [moment(Date.now()).format('YYYY-MM-DD')],
        });
        // get all info payment
        this.totalAmount = this.relatedOrder.totalAmount;
        this.totalDiscountProduct = this.relatedOrder.totalDiscountProduct;
        this.tradeDiscount = this.relatedOrder.tradeDiscount;
        this.totalPayment = this.relatedOrder.totalPayment;
        this.prePayment = this.relatedOrder.prePayment;
        this.textMoney = this.numberToText.doc(this.totalPayment);

        // get list customer
        // this.purchaseOrder.searchCustomer({ keyword: '', page: 1, pageSize: 1000 }).subscribe((data) => {
        //     this.listCustomer = data?.data;
        // });
        // create search product form
        this.productFilterCtrl.valueChanges.subscribe((data) => this.searchListProductActive(data));
        // create search product promotion form
        this.productPromotionFilterCtrl.valueChanges.subscribe((data) => this.searchListProductActive(data));
    }

    ngAfterViewInit(): void {
        // get list employee
        this.purchaseOrder.getAllEmployees('', 1, 1000).subscribe((data) => {
            this.listEmployee = data.data;
            this.listEmployee1 = this.listEmployee;
            this.listEmployee2 = this.listEmployee;
        });

        // get list route
        this.getAllRoute();

        // get list group
        this.purchaseOrder.getAllGroup(1).subscribe((data) => {
            this.listGroup = data;
        });
        // get list wareHouse
        this.getListWareHouse();

        setTimeout(() => {
            this.patchValue();
        }, 0);
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
        this.purchaseOrder.getAllRoute(1, 1000, '').subscribe((data) => {
            this.listAllRoute = data.data;
        });
    }

    setRouteGroupAndEmployee(customerId: any) {
        this.purchaseOrder.getRouteByCustomerId(customerId).subscribe((data) => {
            if (data) {
                this.genOrderForm.patchValue({
                    routeId: data.route?.id,
                    groupId: data.route?.unitTreeGroup?.id,
                    orderEmployeeId: data.route?.employee?.id,
                });
            }
        });
    }

    setInfoCustomer(id: string) {
        // let customer = this.listCustomer.filter((customer: any) => {
        //     return customer.id === id;
        // })[0];
        let customer: any;
        this.purchaseOrder.getCustomerById(id).subscribe((data) => {
            if (data) {
                customer = data;
                console.log(customer);
                this.genOrderForm.patchValue({
                    customerName: null,
                    phone: null,
                    address: null,
                });
                this.genOrderForm.patchValue({
                    customerName: customer.customerName,
                    phone: customer.phone,
                    address: customer.address,
                });
                // set hạn mức dư nợ
                this.purchaseOrder.getCustomerById(id).subscribe((data) => {
                    this.debtLimit = data?.debtLimit;
                });
            }
        });
    }

    countTotalPayment() {
        this.totalPayment = 0;
        if (this.totalAmount) {
            this.totalPayment = this.totalAmount - this.tradeDiscount - this.totalDiscountProduct;
        }
    }

    patchValue() {
        let description;
        if (this.relatedOrder.description) {
            description = `${this.relatedOrder.description} - Bán hàng theo phiếu đặt hàng số [${this.relatedOrder.orderCode}]`;
        } else {
            description = `Bán hàng theo phiếu đặt hàng số [${this.relatedOrder.orderCode}]`;
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
        // loop to get unitId
        this.listProduct.forEach((product: any) => {
            product.unitId = product.unit?.id;
        });
        this.listPromotionProduct.forEach((product: any) => {
            product.unitId = product.unit?.id;
        });
        // set route and group if have customerId
        // if (this.relatedOrder?.customer?.id) {
        //     this.setRouteGroupAndEmployee(this.relatedOrder?.customer?.id);
        // }

        this.pushListProductToDialog();
        this.pushListProductPromotionToDialog();
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
                    unitId: product?.retailUnit?.id, // mặc định là đvt lẻ
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
        // phải filter ra thằng customer đã có sẵn
        this.purchaseOrder.searchCustomer(body).subscribe((data) => {
            this.listCustomer = data.data?.filter((customer: any) => {
                return customer?.id != this.defaultCustomer?.id;
            });
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
        const body = {
            orderDate: moment(this.genOrderForm.get('orderDate')?.value).format('YYYY-MM-DD'),
            groupId: this.genOrderForm.get('groupId')?.value,
            saleEmployeeId: this.genOrderForm.get('saleEmployeeId')?.value,
            // warehouseId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            customerId: this.genOrderForm.get('customerId')?.value,
            routeId: this.genOrderForm.get('routeId')?.value,
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

    updateStatus() {
        const body = {
            purchaseOrderId: this.relatedOrder.id,
            orderDate: this.relatedOrder.orderDate,
            groupId: this.relatedOrder.group?.id,
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
                this.snackbar.openSnackbar(
                    'Thêm mới đơn bán hàng thành công. Lưu ý: Thông tin thay đổi ở phiếu bán hàng sẽ không được cập nhật ở phiếu đặt hàng',
                    5000,
                    'Đóng',
                    'center',
                    'bottom',
                    true,
                );
                this.dialogRef.close();
                this.router.navigate(['/orders']);
            },
        );
    }

    pushListProductToDialog() {
        this.listChoosenProduct = this.listProduct.map((product: any) => {
            return {
                id: product.product.id,
            };
        });
        this.listProductIds = this.listProduct.map((product: any) => {
            return product.product.id;
        });
    }

    pushListProductPromotionToDialog() {
        this.listChoosenProductPromotion = this.listPromotionProduct.map((product: any) => {
            return {
                id: product.product.id,
            };
        });
        this.listPromotionIds = this.listPromotionProduct.map((product: any) => {
            return product.product.id;
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
                let listAdd = this.format.formatProductFromCloseDialogAdd(data, this.listProduct);
                listAdd.forEach((product: any) => {
                    this.listProduct.push(product);
                });
                this.pushListProductToDialog();
            }
        });
    }

    addProductBySearch(product: any, e: any) {
        if (e.source.selected) {
            let isSelected = false;
            if (this.listProductIds.includes(product.id)) {
                isSelected = true;
            } else {
                isSelected = false;
            }
            if (!isSelected) {
                product = this.format.formatProductFromCloseDialogAdd([product], []);
                this.listProduct.push(product[0]);
                this.pushListProductToDialog();
            } else {
                this.snackbar.openSnackbar('Sản phẩm đã có trong đơn', 2000, 'Đóng', 'center', 'bottom', false);
            }
        }
    }

    addProductPromotionBySearch(product: any, e: any) {
        if (e.source.selected) {
            let isSelected = false;
            if (this.listPromotionIds.includes(product.id)) {
                isSelected = true;
            } else {
                isSelected = false;
            }
            if (!isSelected) {
                let productAfterFormat = this.format.formatProductPromotionFromCloseDialogAdd([product], []);
                this.listPromotionProduct.push(productAfterFormat[0]);
                this.pushListProductPromotionToDialog();
            } else {
                this.snackbar.openSnackbar('Sản phẩm đã có trong đơn', 2000, 'Đóng', 'center', 'bottom', false);
            }
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
                listProd: this.relatedOrder.listPromotionProduct,
            },
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (!data.isCancel) {
                let listAdd = this.format.formatProductPromotionFromCloseDialogAdd(data, this.listPromotionProduct);
                listAdd.forEach((product: any) => {
                    this.listPromotionProduct.push(product);
                });
                this.pushListProductPromotionToDialog();
            }
        });
    }

    searchListProductActive(value: any) {
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
