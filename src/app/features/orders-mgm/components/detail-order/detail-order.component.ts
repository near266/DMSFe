import { Component, OnInit, AfterViewInit, Input, DoCheck, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
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
@Component({
    selector: 'app-detail-order',
    templateUrl: './detail-order.component.html',
    styleUrls: ['./detail-order.component.scss'],
})
export class DetailOrderComponent implements OnInit, AfterViewInit, DoCheck, OnDestroy {
    statusList = statusList;
    statusNow!: number;
    type: string = 'View';
    detailOrderForm!: FormGroup;
    detailOrderFakeData: any = [];
    detailOrder: any;
    subscription: Subscription[] = [];
    id: string;

    listPromotionProduct?: ListPromotionProduct[] = [];
    listProduct: any = [];
    listCustomer: any = [];
    listEmployee: any = [];
    listGroup: any = [];
    listChoosenProduct: any = [];
    listWarehouse: any = [];

    totalAmount: number = 0;
    totalDiscountProduct: number = 0;
    tradeDiscount: number = 0;
    totalPayment: number = 0;
    prePayment: number = 0;
    textMoney: any;
    constructor(
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private dataservice: DataService,
        private dialog: MatDialog,
        private router: Router,
        private dataService: DataService,
        private purchaseOrder: PurchaseOrderService,
        private snackbar: SnackbarService,
    ) {}

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
        this.purchaseOrder.msg.subscribe((data) => {
            if (data === 'Done') {
                this.getDetail();
            }
        });
        // xem update thành công chưa -> nếu thành công reload lại data
        this.purchaseOrder.isSucessUpdate.subscribe((data) => {
            if (data === 'Done') {
                this.getDetail();
            }
        });
    }

    getDetail() {
        this.purchaseOrder.detail(this.id).subscribe((data) => {
            this.detailOrder = data;
            console.log(this.detailOrder);
            this.patchValue();
            this.pushListProductToDialog();
            // get all info payment
            this.totalAmount = this.detailOrder.totalAmount;
            this.totalDiscountProduct = this.detailOrder.totalDiscountProduct;
            this.tradeDiscount = this.detailOrder.tradeDiscount;
            this.totalPayment = this.detailOrder.totalPayment;
            this.prePayment = this.detailOrder.prePayment;
            this.textMoney = this.doc(this.totalPayment);
        });
    }

    patchValue() {
        this.detailOrderForm.patchValue({
            orderCode: this.detailOrder.orderCode,
            status: this.detailOrder.status,
            orderDate: this.detailOrder.orderDate,
            deliveryDate: this.detailOrder.deliveryDate,
            orderEmployee: this.detailOrder.orderEmployee?.id, // đang bị null
            customer: {
                code: this.detailOrder.customer?.id,
                name: this.detailOrder.customer?.customerName,
                phone: this.detailOrder.phone,
                address: this.detailOrder.address,
            },
            description: this.detailOrder.description,
        });
        this.listProduct = this.detailOrder.listProduct;
        this.listPromotionProduct = this.detailOrder.listPromotionProduct;
    }

    ngOnDestroy(): void {
        this.subscription.forEach((service) => {
            service.unsubscribe();
        });
    }

    ngAfterViewInit(): void {
        this.getDetail();
        this.getListCustomer();
        this.getListEmployee();
        this.getListWareHouse();
    }

    getListWareHouse() {
        this.purchaseOrder.getAllWarehouses().subscribe((data) => {
            this.listWarehouse = data;
        });
    }

    getListCustomer() {
        this.purchaseOrder.searchCustomer({ keyword: '', page: 1, pageSize: 1000 }).subscribe((data: any) => {
            this.listCustomer = data.data;
        });
    }

    getListEmployee() {
        this.purchaseOrder.getAllEmployees(1, 1000).subscribe((data) => {
            this.listEmployee = data.data;
        });
    }

    ngDoCheck(): void {
        this.purchaseOrder.sendBodyUpdate({
            purchaseOrderId: this.id,
            orderDate: moment(this.detailOrderForm.get('orderDate')?.value).format('YYYY-MM-DD'),
            groupId: this.detailOrderForm.get('groupId')?.value,
            orderEmployeeId: this.detailOrderForm.get('orderEmployee')?.value,
            // warehouseId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            customerId: this.detailOrderForm.get('customer.code')?.value,
            // routeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            type: 0,
            status: this.detailOrderForm.get('status')?.value,
            paymentMethod: 0,
            description: this.detailOrderForm.get('description')?.value,
            phone: this.detailOrderForm.get('customer.phone')?.value,
            address: this.detailOrderForm.get('customer.address')?.value,
            customerName: this.detailOrderForm.get('customer.name')?.value,
            totalAmount: 0,
            totalOfVAT: 0,
            totalDiscountProduct: 0,
            tradeDiscount: 0,
            totalPayment: 0,
            archived: false,
            // lastModifiedBy: 'string',
            lastModifiedDate: moment(Date.now()).format('YYYY-MM-DD'),
            orderCode: this.detailOrder?.orderCode,
            deliveryDate: moment(this.detailOrderForm.get('deliveryDate')?.value).format('YYYY-MM-DD'),
            prePayment: 0,
        });
        // send body update product
        this.purchaseOrder.sendProductUpdate(this.getProductListUpdate());
        // count totalAmount (Tổng tiền hàng)
        this.countTotalAmount();
        // count totalDiscountProduct (Chiết khấu sản phẩm)
        this.countTotalDiscountProduct();
        // count totalPayment
        this.countTotalPayment();
        // number to text
        this.textMoney = this.doc(this.totalPayment);
    }

    countTotalAmount() {
        this.totalAmount = 0;
        this.getProductListUpdate().forEach((product: any) => {
            if (product.totalPrice) {
                this.totalAmount += product.totalPrice;
            }
        });
    }

    countTotalDiscountProduct() {
        this.totalDiscountProduct = 0;
        this.getProductListUpdate().forEach((product: any) => {
            if (product.discount) {
                this.totalDiscountProduct += product.discount;
            }
        });
    }

    countTotalPayment() {
        this.totalPayment = 0;
        if (this.totalAmount) {
            this.totalPayment = this.totalAmount - this.tradeDiscount;
        }
    }

    getProductListUpdate() {
        // console.log(this.listProduct);
        let listProductToSent = this.listProduct.map((product: any) => {
            return {
                purchaseOrderId: this.id,
                productId: product.product.id,
                // productName: product.product.productName,
                unitId: product.unit.id,
                warehouseId: product.warehouse.id,
                unitPrice: product.unitPrice,
                quantity: product.quantity,
                totalPrice: product.totalPrice,
                discount: product.discount,
                discountRate: product.discountRate,
                note: product.note,
                type: product.type,
            };
        });
        return listProductToSent;
    }

    unChoose(productRemove: any) {
        // console.log(productRemove.product.id);
        // this.listProduct = this.listProduct.filter((product: any) => {
        //     return product.product.id != productRemove.product.id;
        // });
        const body = {
            productId: productRemove.product.id,
            purchaseOrderId: this.id,
        };
        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                content: 'Bạn có chắc chắn muốn xóa sản phẩm này',
                action: ['Xóa', 'Hủy'],
            },
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (data === 'Xóa') {
                this.purchaseOrder.removeProduct(body).subscribe(
                    (data) => {},
                    (err) => {
                        this.snackbar.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'bottom', false);
                    },
                    () => {
                        this.snackbar.openSnackbar('Lưu trữ thành công', 2000, 'Đóng', 'center', 'bottom', true);
                    },
                );
            } else {
            }
        });
    }

    setInfoCustomer(id: string) {
        let customer = this.listCustomer.filter((customer: any) => {
            return customer.id === id;
        })[0];
        console.log(customer);
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
    }

    // selectUnit(product: any, value: any) {
    //     product.unitId = value.unit.id;
    //     if (value.type === 'retail') {
    //         product.unitPrice = product.product.retailPrice;
    //     } else if (value.type === 'whosale') {
    //         product.unitPrice = product.product.price;
    //     }
    // }

    discountRate(product: any) {
        product.discountRate = product.discount / product.totalPrice;
    }

    stopPropagation(e: any) {
        e.stopPropagation();
    }

    pushListProductToDialog() {
        console.log(this.listProduct);
        this.listChoosenProduct = this.detailOrder.listProduct.map((product: any) => {
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
                listProd: this.detailOrder.listProduct,
            },
        });
        dialogRef.afterClosed().subscribe((data) => {
            if (!data.isCancel) {
                this.listChoosenProduct = data;
                this.listProduct = this.listChoosenProduct;
            }
        });
    }

    // number to text
    doc1so(so: any) {
        var arr_chuhangdonvi = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
        var resualt = '';
        resualt = arr_chuhangdonvi[so];
        return resualt;
    }

    doc2so(so: any) {
        so = so.replace(' ', '');
        var arr_chubinhthuong = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
        var arr_chuhangdonvi = ['mươi', 'mốt', 'hai', 'ba', 'bốn', 'lăm', 'sáu', 'bảy', 'tám', 'chín'];
        var arr_chuhangchuc = [
            '',
            'mười',
            'hai mươi',
            'ba mươi',
            'bốn mươi',
            'năm mươi',
            'sáu mươi',
            'bảy mươi',
            'tám mươi',
            'chín mươi',
        ];
        var resualt = '';
        var sohangchuc = so.substr(0, 1);
        var sohangdonvi = so.substr(1, 1);
        resualt += arr_chuhangchuc[sohangchuc];
        if (sohangchuc == 1 && sohangdonvi == 1) resualt += ' ' + arr_chubinhthuong[sohangdonvi];
        else if (sohangchuc == 1 && sohangdonvi > 1) resualt += ' ' + arr_chuhangdonvi[sohangdonvi];
        else if (sohangchuc > 1 && sohangdonvi > 0) resualt += ' ' + arr_chuhangdonvi[sohangdonvi];

        return resualt;
    }

    doc3so(so: any) {
        var resualt = '';
        var arr_chubinhthuong = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
        var sohangtram = so.substr(0, 1);
        var sohangchuc = so.substr(1, 1);
        var sohangdonvi = so.substr(2, 1);
        resualt = arr_chubinhthuong[sohangtram] + ' trăm';
        if (sohangchuc == 0 && sohangdonvi != 0) resualt += ' linh ' + arr_chubinhthuong[sohangdonvi];
        else if (sohangchuc != 0) resualt += ' ' + this.doc2so(sohangchuc + ' ' + sohangdonvi);
        return resualt;
    }

    docsonguyen(so: any) {
        var result = '';
        if (so != undefined) {
            //alert(so);
            var arr_So: any = [{ ty: '' }, { trieu: '' }, { nghin: '' }, { tram: '' }];
            var sochuso = so.length;
            for (var i = sochuso - 1; i >= 0; i--) {
                if (sochuso - i <= 3) {
                    if (arr_So['tram'] != undefined) arr_So['tram'] = so.substr(i, 1) + arr_So['tram'];
                    else arr_So['tram'] = so.substr(i, 1);
                } else if (sochuso - i > 3 && sochuso - i <= 6) {
                    if (arr_So['nghin'] != undefined) arr_So['nghin'] = so.substr(i, 1) + arr_So['nghin'];
                    else arr_So['nghin'] = so.substr(i, 1);
                } else if (sochuso - i > 6 && sochuso - i <= 9) {
                    if (arr_So['trieu'] != undefined) arr_So['trieu'] = so.substr(i, 1) + arr_So['trieu'];
                    else arr_So['trieu'] = so.substr(i, 1);
                } else {
                    if (arr_So.ty != undefined) arr_So.ty = so.substr(i, 1) + arr_So.ty;
                    else arr_So.ty = so.substr(i, 1);
                }
                //console.log(arr_So);
            }

            if (arr_So['ty'] > 0) result += this.doc(arr_So['ty']) + ' tỷ';
            if (arr_So['trieu'] > 0) {
                if (arr_So['trieu'].length >= 3 || arr_So['ty'] > 0)
                    result += ' ' + this.doc3so(arr_So['trieu']) + ' triệu';
                else if (arr_So['trieu'].length >= 2) result += ' ' + this.doc2so(arr_So['trieu']) + ' triệu';
                else result += ' ' + this.doc1so(arr_So['trieu']) + ' triệu';
            }
            if (arr_So['nghin'] > 0) {
                if (arr_So['nghin'].length >= 3 || arr_So['trieu'] > 0)
                    result += ' ' + this.doc3so(arr_So['nghin']) + ' nghìn';
                else if (arr_So['nghin'].length >= 2) result += ' ' + this.doc2so(arr_So['nghin']) + ' nghìn';
                else result += ' ' + this.doc1so(arr_So['nghin']) + ' nghìn';
            }
            if (arr_So['tram'] > 0) {
                if (arr_So['tram'].length >= 3 || arr_So['nghin'] > 0) result += ' ' + this.doc3so(arr_So['tram']);
                else if (arr_So['tram'].length >= 2) result += ' ' + this.doc2so(arr_So['tram']);
                else result += ' ' + this.doc1so(arr_So['tram']);
            }
        }
        return result;
    }

    doc(so: any) {
        var kytuthapphan = ',';
        var result = '';
        if (so != undefined) {
            so = ' ' + so + ' ';
            so = so.trim();
            var cautrucso = so.split(kytuthapphan);
            if (cautrucso[0] != undefined) {
                result += this.docsonguyen(cautrucso[0]);
            }
            if (cautrucso[1] != undefined) {
                //alert(this.docsonguyen(cautrucso[1]));
                result += ' phẩy ' + this.docsonguyen(cautrucso[1]);
            }
        }
        return result;
    }
}
