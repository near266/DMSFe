import { AfterViewInit, Component, DoCheck, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { SaleReceiptService } from 'src/app/core/services/saleReceipt.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { NumberToTextService } from 'src/app/core/shared/services/number-to-text.service';

@Component({
    selector: 'app-create-order-sale',
    templateUrl: './create-order-sale.component.html',
    styleUrls: ['./create-order-sale.component.scss'],
})
export class CreateOrderSaleComponent implements OnInit, AfterViewInit, DoCheck {
    listRoute: any = [];
    listGroup: any = [];
    createSale: FormGroup;

    listEmployeeSale: any = [];
    listEmployeeOrder: any = [];
    listCustomer: any = [];
    listProduct: any = [];
    listChoosenProduct = new Array<any>();
    listWarehouse: any = [];
    listPromotionProductAdd: any = [];
    listChoosenProductIds: any = [];
    listSearchedProduct: any = [];

    totalAmount: number = 0;
    totalDiscountProduct: number = 0;
    tradeDiscount: number = 0;
    totalPayment: number = 0;
    prePayment: number = 0;
    textMoney: any;

    // unitPrices: any = [];
    // quantities: any = [];
    // discount: any = [];
    // quantity: any = 0;
    debtLimit: any;

    productFilterCtrl: FormControl = new FormControl();
    constructor(
        private fb: FormBuilder,
        private saleReceipt: SaleReceiptService,
        private snackbar: SnackbarService,
        private router: Router,
        private purchaseOrder: PurchaseOrderService,
        private numberToText: NumberToTextService,
    ) {}

    ngOnInit(): void {
        this.createSale = this.fb.group({
            orderDate: [moment(Date.now()).format('YYYY-MM-DD')],
            saleDate: [moment(Date.now()).format('YYYY-MM-DD')],
            deliveryDate: [moment(Date.now()).format('YYYY-MM-DD')],
            paymentTerm: [moment(Date.now()).format('YYYY-MM-DD')],
            groupId: [null],
            orderEmployeeId: [null],
            routeId: [null],
            saleEmployee: [null],
            customer: this.fb.group({
                id: [null],
                address: [null],
                phone: [null],
                name: [null],
            }),
            debtRecord: [false],
            phone: [null],
            address: [null],
            description: [null],
        });
        // create search product form
        // this.productFilterCtrl.valueChanges.subscribe((data) => this.searchListProductActive(data));
    }

    ngAfterViewInit(): void {
        // get list employee
        this.purchaseOrder.getAllEmployees('', 1, 1000).subscribe((data) => {
            this.listEmployeeSale = data.data;
            this.listEmployeeOrder = data.data;
        });
        // get list customer
        this.purchaseOrder.searchCustomer({ keyword: '', page: 1, pageSize: 1000 }).subscribe((data) => {
            this.listCustomer = data?.data;
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
    }

    searchListRoute(e: any) {
        this.purchaseOrder.getAllRoute(1, 1000, e.target.value).subscribe((data) => {
            if (data) {
                this.listRoute = data.data;
            }
        });
    }

    setRouteGroupAndEmployee(customer: any) {
        if (customer != 0) {
            this.purchaseOrder.getRouteByCustomerId(customer?.id).subscribe((data) => {
                if (data) {
                    this.createSale.patchValue({
                        routeId: data?.route?.id,
                        groupId: data?.route?.unitTreeGroup?.id,
                        orderEmployeeId: data?.route?.employee?.id,
                    });
                }
            });
        }
    }

    searchListCustomer(e: any) {
        let body = {
            keyword: e.target.value,
            page: 1,
            pageSize: 100,
        };
        this.purchaseOrder.searchCustomer(body).subscribe((data) => {
            this.listCustomer = data?.data;
        });
    }

    // stopPropagation(e: any) {
    //     e.stopPropagation();
    // }

    // openDialogProduct() {
    //     const dialogRef = this.dialog.open(ProductListComponent, {
    //         maxWidth: '100vw',
    //         maxHeight: '100vh',
    //         height: '100%',
    //         width: '100%',
    //         panelClass: 'full-screen-modal',
    //         data: {
    //             listId: this.listChoosenProductIds,
    //         },
    //     });
    //     dialogRef.afterClosed().subscribe((data) => {
    //         if (!data.isCancel) {
    //             this.listChoosenProduct = data;
    //             this.listChoosenProduct.forEach((product: any) => {
    //                 product.warehouseId = product.warehouse?.id; // auto chọn kho mặc định
    //                 product.unitId = product?.retailUnit?.id; // auto chọn đơn vị lẻ
    //                 product.unitPrice = product?.retailPrice; // auto chọn giá lẻ
    //             });
    //             this.pushListProductToDialog();
    //         }
    //     });
    // }

    createSaleReceipt() {
        // let lastListChoosen = this.listChoosenProduct.map((product: any) => {
        //     return {
        //         productId: product.id,
        //         productName: product.productName,
        //         unitId: product.unitId,
        //         warehouseId: product.warehouseId,
        //         unitPrice: product.unitPrice,
        //         quantity: product.quantity,
        //         totalPrice: product.totalPrice,
        //         discount: product.discount | 0,
        //         discountRate: product.discountRate | 0,
        //         note: product.note,
        //         type: 0,
        //     };
        // });
        const body = {
            orderDate: moment(this.createSale.get('orderDate')?.value).format('YYYY-MM-DD'),
            groupId: this.createSale.get('groupId')?.value,
            saleEmployeeId: this.createSale.get('saleEmployee')?.value,
            // warehouseId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            customerId: this.createSale.get('customer')?.value?.id?.id,
            routeId: this.createSale.get('routeId')?.value,
            orderEmployeeId: this.createSale.get('orderEmployeeId')?.value,
            type: 0,
            status: 3, //?
            paymentMethod: 0,
            description: this.createSale.get('description')?.value,
            phone: this.createSale.get('customer.phone')?.value,
            address: this.createSale.get('customer.address')?.value,
            customerName: this.createSale.get('customer.name')?.value,
            totalAmount: this.totalAmount,
            totalOfVAT: 0,
            totalDiscountProduct: this.totalDiscountProduct,
            tradeDiscount: this.tradeDiscount,
            totalPayment: this.totalPayment,
            archived: false,
            createdDate: moment(Date.now()).format('YYYY-MM-DD'),
            saleReceiptCode: this.createSale.get('saleEmployee')?.value?.employeeCode,
            deliveryDate: moment(this.createSale.get('deliveryDate')?.value).format('YYYY-MM-DD'),
            saleDate: moment(this.createSale.get('saleDate')?.value).format('YYYY-MM-DD'),
            paymentTerm: moment(this.createSale.get('paymentTerm')?.value).format('YYYY-MM-DD'),
            prePayment: this.prePayment,
            debtRecord: this.createSale.get('debtRecord')?.value,
            listProduct: this.listChoosenProduct,
            listPromotionProduct: this.listPromotionProductAdd,
            source: 'Web',
        };
        this.saleReceipt.create(body).subscribe(
            (data) => {},
            (err) => {
                this.snackbar.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'bottom', false);
            },
            () => {
                this.snackbar.openSnackbar('Thêm mới đơn bán hàng thành công', 2000, 'Đóng', 'center', 'bottom', true);
                this.router.navigate(['/order/sale']);
            },
        );
    }

    // unChoose(productRemove: any) {
    //     this.listChoosenProduct = this.listChoosenProduct.filter((product: any) => {
    //         return product != productRemove;
    //     });
    //     // this.quantity -= productRemove.quantity;
    // }

    close() {
        this.router.navigate(['/order/sale']);
    }

    setInfoCustomer(value: any) {
        if (value != 0) {
            this.createSale.patchValue({
                customer: {
                    name: value.customerName,
                    phone: value.phone,
                    address: value.address,
                },
            });
            // set hạn mức dư nợ
            this.purchaseOrder.getCustomerById(value?.id).subscribe((data) => {
                this.debtLimit = data?.debtLimit;
            });
        }
    }

    // selectUnit(product: any, type: any) {
    //     if (type === 'retail') {
    //         product.unitId = product?.retailUnit?.id;
    //         product.unitPrice = product.retailPrice;
    //     } else if (type == 'whosale') {
    //         product.unitId = product?.wholeSaleUnit?.id;
    //         product.unitPrice = product.price;
    //     }
    //     product.totalPrice = product.quantity * product.unitPrice;
    //     this.discountRate(product);
    // }

    // selectWareHouse(value: any, product: any) {
    //     product.warehouseId = value;
    // }

    // setWareHouseToAllProduct(id: any) {
    //     if (id != 0) {
    //         this.listChoosenProduct.forEach((product: any) => {
    //             product.warehouseId = id;
    //         });
    //     }
    // }

    searchListEmployeeSale(e: any) {
        this.purchaseOrder
            .getAllEmployees(e.target.value, 1, 1000)
            .subscribe((data) => (this.listEmployeeSale = data?.data));
    }

    searchListEmployeeOrder(e: any) {
        this.purchaseOrder
            .getAllEmployees(e.target.value, 1, 1000)
            .subscribe((data) => (this.listEmployeeOrder = data?.data));
    }

    // countTotal(product: any) {
    //     this.quantity += product.quantity;
    // }

    // discountRate(product: any) {
    //     if (product.totalPrice) {
    //         product.discountRate = ((product.discount * 100) / product.totalPrice).toFixed(1);
    //     }
    // }

    countTotalAmount() {
        this.totalAmount = 0;
        this.listChoosenProduct.forEach((product: any) => {
            if (product.totalPrice) {
                this.totalAmount += product.totalPrice;
            }
        });
    }

    countTotalDiscountProduct() {
        this.totalDiscountProduct = 0;
        this.listChoosenProduct.forEach((product: any) => {
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

    // countDiscount(product: any) {
    //     if (product.totalPrice) {
    //         product.discount = (product.discountRate / 100) * product.totalPrice;
    //     }
    // }

    // hơi khác các màn 1 tí vì k format được
    // pushListProductToDialog() {
    //     this.listChoosenProductIds = this.listChoosenProduct.map((product: any) => {
    //         return {
    //             id: product.id,
    //         };
    //     });
    // }

    setProductPromotionAdd(e: any) {
        this.listPromotionProductAdd = e;
    }

    setProductAdd(e: any) {
        this.listChoosenProduct = e;
    }

    // searchListProductActive(value: any) {
    //     const body = {
    //         keyword: value,
    //         sortBy: {
    //             property: 'CreatedDate',
    //             value: true,
    //         },
    //         page: 1,
    //         pageSize: 3,
    //     };
    //     this.purchaseOrder.getListProductActived(body).subscribe((data) => {
    //         this.listSearchedProduct = data?.data;
    //     });
    // }

    // updateTotalPrice(product: any) {
    //     // this.countTotal(product);
    //     product.totalPrice = product.quantity * product.unitPrice;
    // }

    // addProductBySearch(product: any, e: any) {
    //     if (e.source.selected) {
    //         product.warehouseId = product.warehouse?.id; // auto chọn kho mặc định
    //         product.unitId = product?.retailUnit?.id; // auto chọn đơn vị lẻ
    //         product.unitPrice = product?.retailPrice; // auto chọn giá lẻ
    //         this.listChoosenProduct.push(product);
    //         this.pushListProductToDialog();
    //     }
    // }
}
