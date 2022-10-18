import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ListProduct, ListPromotionProduct } from 'src/app/core/model/PurchaseOrder';
import { DataService } from 'src/app/core/services/data.service';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { ProductListComponent } from 'src/app/features/orders-mgm/components/product-list/product-list.component';
import { Subscription } from 'rxjs';
import { SaleReceiptService } from 'src/app/core/services/saleReceipt.service';
import { statusList } from 'src/app/core/data/PurchaseOrderList';
import * as moment from 'moment';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
    statusList = statusList;
    statusNow!: number;
    type: string = 'View';
    detailOrderForm!: FormGroup;
    detailOrder: any = [];
    id: string;
    subscription: Subscription[] = [];

    listProduct: any = [];
    listPromotionProduct?: ListPromotionProduct[] = [];
    listEmployee: any = [];
    listCustomer: any = [];
    listGroup = [
        {
            groupId: '1',
            groupName: 'FT2 - Đông Bắc - QL Tùng (Khu vực Đông Bắc)',
        },
        {
            groupId: '2',
            groupName: 'FT5 - Bắc Miền Trung - QL Trọng (Khu vực Bắc Miền Trung)',
        },
        {
            groupId: '3',
            groupName: 'FT7 - Miền Tây NB - QL Duy',
        },
    ];
    listRoute = [
        {
            routeId: '1',
            routeName: 'Nguyễn Văn Tuấn',
        },
        {
            routeId: '2',
            routeName: 'Đặng Xuân Khu',
        },
        {
            routeId: '3',
            routeName: 'Hồ Tuấn Anh',
        },
    ];

    totalAmount: number = 0;
    totalDiscountProduct: number = 0;
    tradeDiscount: number = 0;
    totalPayment: number = 0;
    prePayment: number = 0;
    totalOfVAT: number = 0;
    textMoney: any;
    constructor(
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private dataservice: DataService,
        private dialog: MatDialog,
        private saleReceipt: SaleReceiptService,
        private purchaseOrder: PurchaseOrderService,
    ) {}

    ngOnInit(): void {
        // get id
        this.id = localStorage.getItem('receiptOrderId')!;
        // create Form
        this.detailOrderForm = this.fb.group({
            saleReceiptCode: [null],
            orderDate: [null],
            saleDate: [null],
            saleEmployee: [null],
            deliveryDate: [null],
            group: [null],
            orderEmployee: [null],
            route: [null],
            customer: this.fb.group({
                code: [null],
                name: [null],
                phone: [null],
                address: [null],
            }),
            description: [null],
            debtLimit: [null],
            debtCurrent: [null],
            paymentMethod: [null],
            totalAmount: [null],
            totalOfVAT: [null],
            totalDiscountProduct: [null],
            tradeDiscount: [null],
            totalPayment: [null],
            prePayment: [null],
            status: [null],
        });
        // get type (Edit or View) from parent Component
        this.subscription.push(
            this.dataservice.type.subscribe((data: any) => {
                this.type = data;
            }),
        );
        // get isChangeStatus
        this.saleReceipt.msg.subscribe((data) => {
            if (data === 'Done') {
                this.getDetail();
            }
        });
        // xem update thành công chưa -> nếu thành công reload lại data
        this.saleReceipt.isSucessUpdate.subscribe((data) => {
            if (data === 'Done') {
                this.getDetail();
            }
        });
    }

    getDetail() {
        this.saleReceipt.searchReceiptById(this.id).subscribe((data) => {
            this.detailOrder = data;
            console.log(data);
            this.patchValue();

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
            saleReceiptCode: this.detailOrder.saleCode,
            orderDate: this.detailOrder.orderDate,
            saleDate: this.detailOrder.saleDate,
            deliveryDate: this.detailOrder.deliveryDate,
            group: this.detailOrder.group?.groupId,
            orderEmployee: this.detailOrder.orderEmployee?.id,
            saleEmployee: this.detailOrder.saleEmployee?.id,
            route: this.detailOrder.route?.routeId,
            customer: {
                code: this.detailOrder?.customer.id,
                phone: this.detailOrder.phone,
                address: this.detailOrder.address,
                name: this.detailOrder.customerName,
            },
            description: this.detailOrder.description,
            status: this.detailOrder.status,
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
    }

    ngDoCheck(): void {
        this.saleReceipt.sendBodyUpdate({
            id: this.detailOrder.id,
            orderDate: moment(this.detailOrderForm.get('orderDate')?.value).format('YYYY-MM-DD'),
            groupId: this.detailOrderForm.get('group')?.value,
            saleCode: this.detailOrder.saleCode,
            saleEmployeeId: this.detailOrderForm.get('saleEmployee')?.value,
            orderEmployeeId: this.detailOrderForm.get('orderEmployee')?.value,
            warehouseId: this.detailOrder.warehouse?.id,
            customerId: this.detailOrderForm.get('customer.code')?.value,
            routeId: this.detailOrderForm.get('route')?.value,
            type: this.detailOrder.type,
            status: this.detailOrderForm.get('status')?.value,
            paymentMethod: 0,
            description: this.detailOrderForm.get('description')?.value,
            phone: this.detailOrderForm.get('customer.phone')?.value,
            address: this.detailOrderForm.get('customer.address')?.value,
            customerName: this.detailOrderForm.get('customer.name')?.value,
            purchaseOrderId: this.detailOrder?.purchaseOrder?.id, // ?
            deliveryDate: moment(this.detailOrderForm.get('deliveryDate')?.value).format('YYYY-MM-DD'),
            saleDate: moment(this.detailOrderForm.get('saleDate')?.value).format('YYYY-MM-DD'),
            paymentTerm: '2022-10-04T00:00:00',
            totalAmount: this.totalAmount,
            totalOfVAT: this.totalOfVAT,
            totalDiscountProduct: this.totalDiscountProduct,
            tradeDiscount: this.tradeDiscount,
            totalPayment: this.totalPayment,
            prePayment: this.prePayment,
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
            console.log(this.listEmployee);
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
