import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
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
export class GenOrderSaleComponent implements OnInit, AfterViewInit {
    statusList = ['Chờ duyệt', 'Đã duyệt', 'Đã giao hàng'];
    groupCites = ['Hà Nội', 'TP Hồ Chí Minh', 'Đà Nẵng'];
    listEmployee: any = [];
    listCustomer: any = [];
    relatedOrder: any = [];
    listProduct: any = [];
    listProductToSentAPI: any = [];
    genOrderForm: FormGroup;
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
        console.log(this.relatedOrder);
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
            totalAmount: 0,
            totalOfVAT: 0,
            totalDiscountProduct: 0,
            tradeDiscount: 0,
            totalPayment: 0,
            archived: false,
            // createdBy: 'string',
            createdDate: moment(Date.now()).format('YYYY-MM-DD'),
            saleReceiptCode: this.genOrderForm.get('saleEmployee')?.value.employeeCode,
            purchaseOrderId: this.relatedOrder.id,
            deliveryDate: moment(this.genOrderForm.get('deliveryDate')?.value).format('YYYY-MM-DD'),
            saleDate: moment(this.genOrderForm.get('saleDate')?.value).format('YYYY-MM-DD'),
            paymentTerm: '2022-10-16T05:26:34.266Z',
            prePayment: 0,
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
}
