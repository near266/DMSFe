import { Component, Inject, OnInit, AfterViewInit, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Route, Router } from '@angular/router';
import * as moment from 'moment';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { SaleReceiptService } from 'src/app/core/services/saleReceipt.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
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
    listCustomer: any = [];
    relatedOrder: any = [];
    listProduct: any = [];
    listProductToSentAPI: any = [];
    genOrderForm: FormGroup;

    totalAmount: number = 0;
    totalDiscountProduct: number = 0;
    tradeDiscount: number = 0;
    totalPayment: number = 0;
    prePayment: number = 0;
    textMoney: any;
    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<GenOrderSaleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private purchaseOrder: PurchaseOrderService,
        private fb: FormBuilder,
        private saleReceipt: SaleReceiptService,
        private snackbar: SnackbarService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.genOrderForm = this.fb.group({
            orderDate: [null],
            saleDate: [null],
            deliveryDate: [null],
            groupId: [null],
            orderEmployeeId: [null],
            routeId: [null],
            saleEmployee: [null],
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
        this.textMoney = this.doc(this.totalPayment);
    }

    ngAfterViewInit(): void {
        // get list employee
        this.purchaseOrder.getAllEmployees(1, 1000).subscribe((data) => {
            this.listEmployee = data.data;
        });
        // get list customer
        this.purchaseOrder.searchCustomer({ keyword: '', page: 1, pageSize: 1000 }).subscribe((data) => {
            this.listCustomer = data.data;
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
        this.textMoney = this.doc(this.totalPayment);
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
            orderEmployeeId: this.relatedOrder.orderEmployee.id,
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
            saleEmployeeId: this.genOrderForm.get('saleEmployee')?.value.id,
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
            saleReceiptCode: this.genOrderForm.get('saleEmployee')?.value.employeeCode,
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
                this.snackbar.openSnackbar('Thêm mới đơn bán hàng thành công', 2000, 'Đóng', 'center', 'bottom', true);
                this.dialogRef.close();
                this.router.navigate(['/orders']);
            },
        );
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
