import { Component, OnInit, AfterViewInit, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { SaleReceiptService } from 'src/app/core/services/saleReceipt.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ProductListComponent } from 'src/app/features/orders-mgm/components/product-list/product-list.component';

@Component({
    selector: 'app-create-order-sale',
    templateUrl: './create-order-sale.component.html',
    styleUrls: ['./create-order-sale.component.scss'],
})
export class CreateOrderSaleComponent implements OnInit, AfterViewInit, DoCheck {
    groupCites = ['Hà Nội', 'TP Hồ Chí Minh', 'Đà Nẵng'];
    createSale: FormGroup;

    listEmployee: any = [];
    listCustomer: any = [];
    listProduct: any = [];
    listChoosenProduct = new Array<any>();
    listWarehouse: any = [];

    totalAmount: number = 0;
    totalDiscountProduct: number = 0;
    tradeDiscount: number = 0;
    totalPayment: number = 0;
    prePayment: number = 0;
    textMoney: any;

    unitPrices: any = [];
    quantities: any = [];
    discount: any = [];
    quantity: any = 0;
    constructor(
        private dialog: MatDialog,
        private fb: FormBuilder,
        private saleReceipt: SaleReceiptService,
        private snackbar: SnackbarService,
        private router: Router,
        private purchaseOrder: PurchaseOrderService,
    ) {}

    ngOnInit(): void {
        this.createSale = this.fb.group({
            orderDate: [null],
            saleDate: [null],
            deliveryDate: [null],
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
            phone: [null],
            address: [null],
            description: [null],
        });
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
        // get list warehouse
        this.purchaseOrder.getAllWarehouses().subscribe((data) => {
            this.listWarehouse = data;
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
            data: this.listChoosenProduct,
        });
        dialogRef.afterClosed().subscribe((data) => {
            console.log(data);
            this.listChoosenProduct = data;
        });
    }

    createSaleReceipt() {
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
                discountRate: (product.discountRate * 100000) | 0,
                note: product.note,
                type: 0,
            };
        });
        const body = {
            orderDate: moment(this.createSale.get('orderDate')?.value).format('YYYY-MM-DD'),
            groupId: 'ef6c9edf-5445-4dbf-b0f3-d65d6412cfc0',
            saleEmployeeId: this.createSale.get('saleEmployee')?.value,
            // warehouseId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            customerId: this.createSale.get('customer')?.value?.id?.id,
            // routeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
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
            // createdBy: 'string',
            createdDate: moment(Date.now()).format('YYYY-MM-DD'),
            saleReceiptCode: this.createSale.get('saleEmployee')?.value.employeeCode,
            // purchaseOrderId: this.relatedOrder.id,
            deliveryDate: moment(this.createSale.get('deliveryDate')?.value).format('YYYY-MM-DD'),
            saleDate: moment(this.createSale.get('saleDate')?.value).format('YYYY-MM-DD'),
            paymentTerm: '2022-10-16T05:26:34.266Z',
            prePayment: this.prePayment,
            // debtRecord: true,
            listProduct: lastListChoosen,
            source: 'Web',
        };
        console.log(body);
        this.saleReceipt.create(body).subscribe(
            (data) => {},
            (err) => {
                this.snackbar.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'bottom', false);
            },
            () => {
                this.snackbar.openSnackbar('Thêm mới đơn bán hàng thành công', 2000, 'Đóng', 'center', 'bottom', true);
                this.router.navigate(['/ordersale']);
            },
        );
    }

    unChoose(productRemove: any) {
        this.listChoosenProduct = this.listChoosenProduct.filter((product: any) => {
            return product != productRemove;
        });
        this.quantity -= productRemove.quantity;
    }

    close() {
        this.router.navigate(['/ordersale']);
    }

    setInfoCustomer(value: any) {
        this.createSale.patchValue({
            customer: {
                name: value.customerName,
                phone: value.phone,
                address: value.address,
            },
        });
    }

    selectUnit(value: any, product: any, i: any) {
        // if (value.type === 'retail') {
        //     this.unitPrices[i] = product.reatailPrice;
        // } else if (value.type === 'whosale') {
        //     this.unitPrices[i] = product.price;
        // }
        console.log(product);
        product.unitId = value.unit.id;
        product.type = value.type;
        if (value.type === 'retail') {
            product.unitPrice = product.retailPrice;
        } else if (value.type === 'whosale') {
            product.unitPrice = product.price;
        }
    }

    selectWareHouse(value: any, product: any) {
        product.warehouseId = value;
    }

    countTotal(product: any) {
        this.quantity += product.quantity;
    }

    discountRate(product: any) {
        product.discountRate = product.discount / product.totalPrice;
    }

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
            this.totalPayment = this.totalAmount - this.tradeDiscount;
        }
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
