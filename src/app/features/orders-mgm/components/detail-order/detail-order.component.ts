import { Component, OnInit, AfterViewInit, Input, DoCheck, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import {
    ListProduct,
    ListPromotionProduct,
    PurchaseOrder,
    PurchaseOrderDetail,
} from 'src/app/core/model/PurchaseOrder';
import { DetailPurchaseOrder, statusList } from 'src/app/core/data/PurchaseOrderList';
import { DataService } from 'src/app/core/services/data.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProductListComponent } from '../product-list/product-list.component';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import * as moment from 'moment';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { NumberToTextService } from 'src/app/core/shared/services/number-to-text.service';
import { FormatService } from '../../services/format.service';
import { ProductFieldTextarea } from 'src/app/features/product/components/add-product-dialog/add-product-details/product-field-type/product-field-type.component';
@Component({
    selector: 'app-detail-order',
    templateUrl: './detail-order.component.html',
    styleUrls: ['./detail-order.component.scss'],
})
export class DetailOrderComponent implements OnChanges, OnInit, AfterViewInit, DoCheck, OnDestroy {
    statusList = statusList;
    detailOrderForm!: FormGroup;
    subscription: Subscription[] = [];

    statusNow!: number;
    detailOrder: any;
    id: string;
    type: string = 'View';
    isRemove = false;

    listPromotionProduct: any = [];
    listProduct: any = [];
    listCustomer: any = [];
    listEmployee: any = [];
    listGroup: any = [];
    listRoute: any = [];
    listChoosenProduct: any = [];
    listWarehouse: any = [];
    listProductRemove: any = [];
    listProductPromotionRemove: any = [];
    listProductAdd: any = [];
    listPromotionProductAdd: any = [];
    listChoosenProductPromotion: any = [];
    listSearchedProduct: any = [];
    listProductIdsArray: any = [];
    listProductPromotionIdsArray: any = [];

    totalAmount: number = 0;
    totalDiscountProduct: number = 0;
    tradeDiscount: number = 0;
    totalPayment: number = 0;
    prePayment: number = 0;
    textMoney: any;
    debtLimit: any;
    defaultCustomer: any;
    defaultOrderEmployee: any;

    // coppy
    groupCoppy: any = '';
    orderCoppy: any = '';
    routeCoppy: any = '';
    customerCoppy: any = '';

    productFilterCtrl: FormControl = new FormControl();
    productPromotionFilterCtrl: FormControl = new FormControl();
    constructor(
        private fb: FormBuilder,
        private dataservice: DataService,
        private dialog: MatDialog,
        private purchaseOrder: PurchaseOrderService,
        private numberToText: NumberToTextService,
        private format: FormatService,
        private snackbar: SnackbarService,
    ) {}
    ngOnChanges(changes: SimpleChanges): void {}
    ngOnInit(): void {
        this.id = localStorage.getItem('purchaseOrderId')!;
        // create Form
        this.detailOrderForm = this.fb.group({
            orderCode: [null],
            status: [null],
            orderDate: [null],
            deliveryDate: [null],
            orderEmployee: [null],
            groupId: [null],
            routeId: [null],
            customer: this.fb.group({
                code: [null],
                name: [null],
                phone: [null],
                address: [null],
            }),
            description: [null],
        });
        // get type (Edit or View) from parent Component
        this.subscription.push(
            this.dataservice.type.subscribe((data: any) => {
                this.type = data;
            }),
        );
        // get isChangeStatus
        this.subscription.push(
            this.purchaseOrder.msg.subscribe((data) => {
                if (data === 'Done') {
                    this.getDetail();
                }
            }),
        );
        // xem update thành công chưa -> nếu thành công reload lại data
        this.subscription.push(
            this.purchaseOrder.isSucessUpdate.subscribe((data) => {
                if (data === 'Done') {
                    this.getDetail();
                    // nếu update thành công -> list AddProduct  = []
                    this.listProductAdd = [];
                    this.listPromotionProductAdd = [];
                }
            }),
        );
        // create search product form
        this.productFilterCtrl.valueChanges.subscribe((data) => this.searchListProductActive(data));
        // create search product promotion form
        this.productPromotionFilterCtrl.valueChanges.subscribe((data) => this.searchListProductActive(data));
    }

    ngDoCheck(): void {
        this.purchaseOrder.sendBodyUpdate({
            purchaseOrderId: this.id,
            orderDate: moment(this.detailOrderForm.get('orderDate')?.value).format('YYYY-MM-DD'),
            groupId: this.detailOrderForm.get('groupId')?.value,
            orderEmployeeId: this.detailOrderForm.get('orderEmployee')?.value,
            // warehouseId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            customerId: this.detailOrderForm.get('customer.code')?.value,
            routeId: this.detailOrderForm.get('routeId')?.value,
            type: 0,
            status: this.detailOrderForm.get('status')?.value,
            paymentMethod: 0,
            description: this.detailOrderForm.get('description')?.value,
            phone: this.detailOrderForm.get('customer.phone')?.value,
            address: this.detailOrderForm.get('customer.address')?.value,
            customerName: this.detailOrderForm.get('customer.name')?.value,
            totalAmount: this.totalAmount,
            totalOfVAT: 0,
            totalDiscountProduct: this.totalDiscountProduct,
            tradeDiscount: this.tradeDiscount,
            totalPayment: this.totalPayment,
            archived: false,
            // lastModifiedBy: 'string',
            lastModifiedDate: moment(Date.now()).format('YYYY-MM-DD'),
            orderCode: this.detailOrder?.orderCode,
            deliveryDate: moment(this.detailOrderForm.get('deliveryDate')?.value).format('YYYY-MM-DD'),
            prePayment: this.prePayment,
        });
        // send body update product
        this.purchaseOrder.sendProductUpdate(this.getProductListUpdate());
        // send body update product promotion
        this.purchaseOrder.sendProductPromotionUpdate(this.getPromotionProductListUpdate());
        // send body add product
        this.purchaseOrder.sendProductAdd(this.getProductListAdd());
        // send body add product promotion
        this.purchaseOrder.sendProductPromotionAdd(this.getProductPromotionListAdd());
        // count totalAmount (Tổng tiền hàng)
        this.countTotalAmount();
        // count totalDiscountProduct (Chiết khấu sản phẩm)
        this.countTotalDiscountProduct();
        // count totalPayment
        this.countTotalPayment();
        // number to text
        this.textMoney = this.numberToText.doc(this.totalPayment);
    }

    ngOnDestroy(): void {
        this.subscription.forEach((service) => {
            service.unsubscribe();
        });
    }

    ngAfterViewInit(): void {
        this.getDetail();
        // this.getListCustomer();
        // this.getListEmployee();
        this.getListWareHouse();
        this.getListRoute();
        this.getListGroup();
    }

    getCoppyText() {
        this.groupCoppy = this.detailOrder?.group?.name;
        this.orderCoppy =
            this.detailOrder?.orderEmployee?.employeeCode + ' - ' + this.detailOrder?.orderEmployee?.employeeName;
        this.routeCoppy = this.detailOrder?.route?.routeName;
        this.customerCoppy =
            this.detailOrder?.customer?.customerCode + ' - ' + this.detailOrder?.customer?.customerName;
    }

    getDetail() {
        this.subscription.push(
            this.purchaseOrder.detail(this.id).subscribe((data) => {
                this.detailOrder = data;
                // lấy ra default customer (trước khi patch value)
                this.defaultCustomer = this.detailOrder?.customer;
                // lấy ra default employee
                this.defaultOrderEmployee = this.detailOrder?.orderEmployee;
                this.patchValue();
                this.pushListProductToDialog();
                this.pushListProductPromotionToDialog();
                // get all info payment
                this.totalAmount = this.detailOrder.totalAmount;
                this.totalDiscountProduct = this.detailOrder.totalDiscountProduct;
                this.tradeDiscount = this.detailOrder.tradeDiscount;
                this.totalPayment = this.detailOrder.totalPayment;
                this.prePayment = this.detailOrder.prePayment;
                this.textMoney = this.numberToText.doc(this.totalPayment);
                // set hạn mức dư nợ
                this.purchaseOrder.getCustomerById(this.detailOrder?.customer?.id).subscribe((data) => {
                    this.debtLimit = data?.debtLimit;
                });
                // get coppy text
                this.getCoppyText();
            }),
        );
    }

    patchValue() {
        this.detailOrderForm.patchValue({
            orderCode: this.detailOrder.orderCode,
            status: this.detailOrder.status,
            orderDate: this.detailOrder.orderDate,
            deliveryDate: this.detailOrder.deliveryDate,
            orderEmployee: this.detailOrder.orderEmployee?.id, // đang bị null
            routeId: this.detailOrder?.route?.id,
            groupId: this.detailOrder?.group?.id,
            customer: {
                code: this.detailOrder.customer?.id,
                name: this.detailOrder.customer?.customerName,
                phone: this.detailOrder.phone,
                address: this.detailOrder.address,
            },
            description: this.detailOrder.description,
        });
        // get list product
        this.listProduct = this.detailOrder.listProduct;
        // get list promotion product
        this.listPromotionProduct = this.detailOrder.listPromotionProduct;
        // loop to map warehouseId
        this.listProduct.forEach((product: any) => {
            product.warehouseId = product.warehouse?.id;
        });
        this.listPromotionProduct.forEach((product: any) => {
            product.warehouseId = product.warehouse?.id;
        });
    }

    test(e: any) {
        console.log(e);
    }

    getListWareHouse() {
        this.subscription.push(
            this.purchaseOrder.getAllWarehouses().subscribe((data) => {
                this.listWarehouse = data;
            }),
        );
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

    getListCustomer() {
        this.subscription.push(
            this.purchaseOrder.searchCustomer({ keyword: '', page: 1, pageSize: 1000 }).subscribe((data: any) => {
                this.listCustomer = data.data;
            }),
        );
    }

    getListEmployee() {
        this.subscription.push(
            this.purchaseOrder.getAllEmployees('', 1, 1000).subscribe((data) => {
                this.listEmployee = data.data;
            }),
        );
    }

    getListRoute() {
        this.purchaseOrder.getAllRoute(1, 1000, '').subscribe((data) => (this.listRoute = data.data));
    }

    getListGroup() {
        this.purchaseOrder.getAllGroup(1).subscribe((data) => (this.listGroup = data));
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

    getProductListUpdate() {
        // console.log(this.listProduct);
        let listProductToSent = this.listProduct.map((product: any) => {
            return {
                purchaseOrderId: this.id,
                productId: product?.product?.id,
                // productName: product.product.productName,
                unitId: product.unit?.id,
                warehouseId: product.warehouseId,
                unitPrice: product.unitPrice,
                quantity: product.quantity,
                totalPrice: product.totalPrice,
                discount: product.discount || 0,
                discountRate: product.discountRate || 0,
                note: product.note,
                type: product.type,
                index: product.index, // thêm index để phân biệt sản phẩm trùng
            };
        });
        return listProductToSent;
    }

    getPromotionProductListUpdate() {
        let listProductToSent = this.listPromotionProduct.map((product: any) => {
            return {
                purchaseOrderId: this.id,
                productId: product?.product?.id,
                // productName: product.product.productName,
                unitId: product.unit?.id,
                warehouseId: product.warehouseId,
                unitPrice: product.unitPrice,
                quantity: product.quantity,
                totalPrice: 0,
                discount: 0,
                discountRate: 0,
                note: product.note,
                type: product.type,
                index: product.index, // đánh index
            };
        });
        return listProductToSent;
    }

    getProductListAdd() {
        let listProductAdd = this.listProductAdd.map((product: any) => {
            return {
                purchaseOrderId: this.id,
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
        return listProductAdd;
    }

    getProductPromotionListAdd() {
        let listProductAdd = this.listPromotionProductAdd.map((product: any) => {
            return {
                purchaseOrderId: this.id,
                productId: product?.product?.id,
                // productName: product.product.productName,
                unitId: product.unit.id,
                warehouseId: product.warehouseId,
                unitPrice: product.unitPrice,
                quantity: product.quantity,
                totalPrice: 0,
                discount: 0,
                discountRate: 0,
                note: product.note,
                type: product.type,
            };
        });
        return listProductAdd;
    }

    unChoose(productRemove: any) {
        // send to service
        this.listProductRemove.push({
            // productId: productRemove.product.id,
            // type: productRemove.type,
            // unitId: productRemove.unit?.id,
            // warehouseId: productRemove.warehouseId,
            index: productRemove.index,
        });
        this.isRemove = true;
        this.purchaseOrder.sendProductRemove({
            isRemove: this.isRemove,
            list: this.listProductRemove,
        });
        // remove to list product
        this.listProduct = this.listProduct.filter((product: any) => {
            return productRemove.index != product.index;
        });
        this.pushListProductToDialog();
    }

    unChoosePromotion(productRemove: any) {
        // send to service
        this.listProductPromotionRemove.push({
            // productId: productRemove.product.id,
            // type: productRemove.type,
            // unitId: productRemove.unit?.id,
            // warehouseId: productRemove.warehouseId,
            index: productRemove.index,
        });
        this.isRemove = true;
        this.purchaseOrder.sendProductPromotionRemove({
            isRemove: this.isRemove,
            list: this.listProductPromotionRemove,
        });
        // remove to list product
        this.listPromotionProduct = this.listPromotionProduct.filter((product: any) => {
            return productRemove.index != product.index;
        });
        this.pushListProductPromotionToDialog();
    }

    unChooseFromListAdd(productRemove: any) {
        let indexOf = this.listProductAdd.indexOf(productRemove);
        // remove from list add
        // this.listProductAdd = this.listProductAdd.filter((product: any) => {
        //     return productRemove.product.id != product?.product?.id;
        // });
        this.listProductAdd.splice(indexOf, 1);
        this.pushListProductToDialog();
    }

    unChooseFromListAddPromotion(productRemove: any) {
        let indexOf = this.listPromotionProductAdd.indexOf(productRemove);
        // remove from list add
        // this.listPromotionProductAdd = this.listPromotionProductAdd.filter((product: any) => {
        //     return productRemove.product.id != product?.product?.id;
        // });
        this.listPromotionProductAdd.splice(indexOf, 1);
        this.pushListProductPromotionToDialog();
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

    discountRate(product: any) {
        if (product.totalPrice) {
            product.discountRate = ((product.discount * 100) / product.totalPrice).toFixed(1);
        }
    }

    stopPropagation(e: any) {
        e.stopPropagation();
    }

    pushListProductToDialog() {
        this.listChoosenProduct = this.detailOrder.listProduct.map((product: any) => {
            return {
                id: product.product.id,
            };
        });
        this.listProductAdd.forEach((product: any) => {
            this.listChoosenProduct.push({ id: product.product.id });
        });
    }

    pushListProductPromotionToDialog() {
        this.listChoosenProductPromotion = this.detailOrder.listPromotionProduct.map((product: any) => {
            return {
                id: product.product.id,
            };
        });
        this.listPromotionProductAdd.forEach((product: any) => {
            this.listChoosenProductPromotion.push({ id: product.product.id });
        });
        this.listChoosenProductPromotion.forEach((product: any) => {
            this.listProductPromotionIdsArray.push(product.id);
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
                listProd: this.listChoosenProduct, // để tạm
            },
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (!data.isCancel) {
                if (this.formatFormProduct(data)) {
                    let listAdd = this.listAddProduct(this.formatFormProduct(data));
                    listAdd.forEach((product: any) => {
                        this.listProductAdd.push(product);
                    });
                }
                this.pushListProductToDialog();
            }
        });
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
                listProd: this.detailOrder.listPromotionProduct,
            },
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (!data.isCancel) {
                if (this.formatFormProductPromotion(data)) {
                    let listAdd = this.listAddProductPromotion(this.formatFormProductPromotion(data));
                    // this.listPromotionProductAdd = [];
                    // this.listPromotionProductAdd = listAdd;
                    listAdd.forEach((product: any) => {
                        this.listPromotionProductAdd.push(product);
                    });
                    this.pushListProductPromotionToDialog();
                }
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
                    warehouseId: product?.warehouse?.id || 'fcb4a590-4f5c-11ed-bdc3-0242ac120002', // auto là kho chính nếu sản phẩm chưa có kho mặc định
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
                    warehouseId: product?.warehouse?.id || '04cb0fee-4f5d-11ed-bdc3-0242ac120002', // auto là khuyến mại nếu chưa có kho mặc địch của sp
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

    // loop to reduce available product
    listAddProduct(list: any) {
        let listAddProduct = [];
        console.log(this.listChoosenProduct);
        // if (list && this.listProduct) {
        //     let listAvailbleIds = this.listProduct.map((product: any) => {
        //         return product?.product?.id;
        //     });
        //     listAddProduct = list.filter((product: any) => {
        //         return !listAvailbleIds.includes(product.product.id);
        //     });
        // }
        if (list && this.listProductIdsArray) {
            // let listAvailbleIds = this.listProduct.map((product: any) => {
            //     return product?.product?.id;
            // });
            listAddProduct = list.filter((product: any) => {
                return !this.listProductIdsArray.includes(product.product.id);
            });
        }
        return listAddProduct;
    }

    // loop to reduce available product promotion
    listAddProductPromotion(list: any) {
        let listAddProduct = [];
        if (list && this.listPromotionProduct) {
            // let listAvailbleIds = this.listPromotionProduct.map((product: any) => {
            //     return product?.product?.id;
            // });
            listAddProduct = list.filter((product: any) => {
                return !this.listProductPromotionIdsArray.includes(product.product.id);
            });
        }
        return listAddProduct;
    }

    countDiscount(product: any) {
        if (product.totalPrice) {
            product.discount = (product.discountRate / 100) * product.totalPrice;
        }
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
            this.listSearchedProduct = data?.data;
        });
    }

    addProductBySearch(product: any, e: any) {
        if (e.source.selected) {
            // let isSelected = false;
            // if (this.listProductIdsArray.includes(product.id)) {
            //     isSelected = true;
            // } else {
            //     isSelected = false;
            // }
            // if (!isSelected) {
            //     product = this.formatFormProduct([product]);
            //     this.listProductAdd.push(product[0]);
            //     this.pushListProductToDialog();
            // } else {
            //     this.snackbar.openSnackbar('Sản phẩm đã có trong đơn', 2000, 'Đóng', 'center', 'bottom', false);
            // }
            product = this.formatFormProduct([product]);
            this.listProductAdd.push(product[0]);
            this.pushListProductToDialog();
        }
    }

    addProductPromotionBySearch(product: any, e: any) {
        if (e.source.selected) {
            // let isSelected = false;
            // if (this.listProductPromotionIdsArray.includes(product.id)) {
            //     isSelected = true;
            // } else {
            //     isSelected = false;
            // }
            // if (!isSelected) {
            //     product = this.formatFormProductPromotion([product]);
            //     this.listPromotionProductAdd.push(product[0]);
            //     this.pushListProductPromotionToDialog();
            // } else {
            //     this.snackbar.openSnackbar('Sản phẩm đã có trong đơn', 2000, 'Đóng', 'center', 'bottom', false);
            // }
            product = this.formatFormProductPromotion([product]);
            this.listPromotionProductAdd.push(product[0]);
            this.pushListProductPromotionToDialog();
        }
    }

    coppy(value: any, e: any) {
        if (value) {
            this.stopPropagation(e);
            navigator.clipboard.writeText(value);
            this.snackbar.openSnackbar('Sao chép thành công', 1000, 'Đóng', 'center', 'bottom', true);
        }
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
