import { Component, OnInit, AfterViewInit, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DataService } from 'src/app/core/services/data.service';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ProductListComponent } from '../product-list/product-list.component';

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
    groupCites = ['Hà Nội', 'TP Hồ Chí Minh', 'Đà Nẵng'];
    createForm: FormGroup;
    unitPrices: any = [];
    quantities: any = [];
    discount: any = [];
    quantity: any = 0;

    listCustomer: any;
    listChoosenProduct: any = [];
    listEmployee: any = [];
    listWarehouse: any = [];

    totalAmount: number = 0;
    totalDiscountProduct: number = 0;
    tradeDiscount: number = 0;
    totalPayment: number = 0;
    prePayment: number = 0;
    textMoney: any;
    constructor(
        private dataService: DataService,
        private dialog: MatDialog,
        private fb: FormBuilder,
        private purchaseOrder: PurchaseOrderService,
        private snackbar: SnackbarService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.createForm = this.fb.group({
            purchaseOrderId: [null],
            orderDate: [null],
            groupId: [null],
            orderEmployeeId: [null],
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
            deliveryDate: [null],
            prePayment: [null],
        });
    }

    ngAfterViewInit(): void {
        // get list customer
        this.purchaseOrder.searchCustomer({ keyword: '', page: 1, pageSize: 1000 }).subscribe((data) => {
            this.listCustomer = data.data;
        });
        // get list employee
        this.purchaseOrder.getAllEmployees(1, 10000).subscribe((data) => {
            this.listEmployee = data.data;
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

    countTotal(product: any) {
        this.quantity += product.quantity;
    }

    discountRate(product: any) {
        product.discountRate = product.discount / product.totalPrice;
    }

    stopPropagation(e: any) {
        e.stopPropagation();
    }

    passingDataFrom() {
        this.dataService.openProductList('create', 'Đây là tạo sản phẩm');
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
                discountRate: (product.discountRate * 100000) | 0,
                note: product.note,
                type: 0,
            };
        });
        const body = {
            orderDate: moment(this.createForm.get('orderDate')?.value).format('YYYY-MM-DD'),
            // groupId: 'ef6c9edf-5445-4dbf-b0f3-d65d6412cfc0', // Chưa có api get
            orderEmployeeId: this.createForm.get('orderEmployeeId')?.value,
            // warehouseId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            customerId: this.createForm.get('customer.customerId')?.value,
            // routeId: null, // Chưa có API
            type: 0,
            status: this.createForm.get('status')?.value,
            description: this.createForm.get('description')?.value,
            phone: this.createForm.get('customer.phone')?.value,
            address: this.createForm.get('customer.address')?.value,
            customerName: this.createForm.get('customer.customerName')?.value,
            archived: false,
            createdDate: moment(Date.now()).format('YYYY-MM-DD'),
            deliveryDate: moment(this.createForm.get('deliveryDate')?.value).format('YYYY-MM-DD'),
            listProduct: lastListChoosen,
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
                console.log(err);
                this.snackbar.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'bottom', false);
            },
            () => {
                console.log('Sucesss');
                this.snackbar.openSnackbar('Tạo mới đơn đặt hàng thành công', 2000, 'Đóng', 'center', 'bottom', true);
                this.router.navigate(['/orders']);
            },
        );
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
    }

    unChoose(productRemove: any) {
        this.listChoosenProduct = this.listChoosenProduct.filter((product: any) => {
            return product != productRemove;
        });
        this.quantity -= productRemove.quantity;
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
