import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { SaleReceiptService } from 'src/app/core/services/saleReceipt.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ProductListComponent } from 'src/app/features/orders-mgm/components/product-list/product-list.component';

@Component({
    selector: 'app-gen-return-order',
    templateUrl: './gen-return-order.component.html',
    styleUrls: ['./gen-return-order.component.scss'],
})
export class GenReturnOrderComponent implements OnInit, AfterViewInit {
    statusList = ['Chờ duyệt', 'Đã duyệt', 'Đã giao hàng'];
    groupCites = ['Hà Nội', 'TP Hồ Chí Minh', 'Đà Nẵng'];
    listEmployees: any = [];
    listCustomer: any = [];
    listStatus = [
        {
            value: 0,
            name: 'Chờ duyệt',
        },
        {
            value: 1,
            name: 'Đã duyệt',
        },
    ];
    genReturnForm: FormGroup;
    saleReceipt: any;
    listProduct: any = [];

    totalAmount: number = 0;
    totalDiscountProduct: number = 0;
    tradeDiscount: number = 0;
    totalPayment: number = 0;
    prePayment: number = 0;
    totalOfVAT: number = 0;
    textMoney: any;
    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<GenReturnOrderComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private purchaseOrder: PurchaseOrderService,
        private fb: FormBuilder,
        private snackbar: SnackbarService,
        private saleReceiptSerivce: SaleReceiptService,
    ) {}

    ngOnInit(): void {
        this.saleReceipt = this.data;
        this.listProduct = this.data.listProduct;
        console.log(this.data);
        this.genReturnForm = this.fb.group({
            saleCode: [null],
            orderDate: [null],
            orderEmployee: [null],
            customerId: [null],
            name: [null],
            address: [null],
            phone: [null],
            description: [null],
            groupId: [null],
            status: [0],
            returnDate: [null],
        });
    }

    ngAfterViewInit(): void {
        this.getListCustomer();
        this.getListEmployees();
        setTimeout(() => {
            this.patchValue();
            // get all info payment
            this.totalAmount = this.data.totalAmount;
            this.totalDiscountProduct = this.data.totalDiscountProduct;
            this.tradeDiscount = this.data.tradeDiscount;
            this.totalPayment = this.data.totalPayment;
            this.prePayment = this.data.prePayment;
            this.textMoney = this.doc(this.totalPayment);
        }, 0);
    }

    patchValue() {
        let description = `${this.saleReceipt.description} (Trả hàng theo đơn bán số ${this.saleReceipt.saleCode})`;
        this.genReturnForm.patchValue({
            saleCode: this.saleReceipt.saleCode,
            orderDate: this.saleReceipt.orderDate,
            orderEmployee: this.saleReceipt.orderEmployee?.id,
            customerId: this.saleReceipt.customer?.id,
            name: this.saleReceipt.customerName,
            address: this.saleReceipt.address,
            phone: this.saleReceipt.phone,
            description: description,
            groupId: this.saleReceipt.group?.id,
        });
    }

    getListCustomer() {
        this.purchaseOrder
            .searchCustomer({ keyword: '', page: 1, pageSize: 1000 })
            .subscribe((data) => (this.listCustomer = data.data));
    }

    getListEmployees() {
        this.purchaseOrder.getAllEmployees(1, 1000).subscribe((data) => {
            this.listEmployees = data.data;
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

    save() {
        // this.dialogRef.close('Lưu');
        // gen productList match form
        let listProduct = this.listProduct.map((product: any) => {
            return {
                productId: product.product.id,
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
        const body = {
            // id: this.data.id,
            orderDate: moment(this.genReturnForm.get('orderDate')?.value).format('YYYY-MM-DD'),
            groupId: this.genReturnForm.get('groupId')?.value,
            orderEmployeeId: this.genReturnForm.get('orderEmployee')?.value,
            warehouseId: null, // không cần truyền cũng được
            customerId: this.genReturnForm.get('customerId')?.value,
            type: 0,
            status: this.genReturnForm.get('status')?.value,
            description: this.genReturnForm.get('description')?.value,
            phone: this.genReturnForm.get('phone')?.value,
            address: this.genReturnForm.get('address')?.value,
            customerName: this.genReturnForm.get('name')?.value,
            totalAmount: this.totalAmount,
            totalOfVAT: this.totalOfVAT,
            totalDiscountProduct: this.totalDiscountProduct,
            tradeDiscount: this.tradeDiscount,
            totalPayment: this.totalPayment,
            // createdBy: 'string',
            // createdDate: '2022-10-18T03:03:58.348Z',
            // returnCode: 'string',
            saleRecieptId: this.data.id,
            returnDate: this.genReturnForm.get('returnDate')?.value,
            listProduct: listProduct,
        };
        this.saleReceiptSerivce.createReturnOrder(body).subscribe(
            (data: any) => {},
            (err: any) => {
                this.snackbar.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'bottom', false);
            },
            () => {
                this.snackbar.openSnackbar('Thêm mới đơn trả thành công', 2000, 'Đóng', 'center', 'bottom', true);
                this.dialogRef.close('Lưu');
            },
        );
    }

    letProductListSendAPI() {
        return;
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
