import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { DataService } from 'src/app/core/services/data.service';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { ProductListComponent } from '../product-list/product-list.component';

@Component({
    selector: 'app-create-purchase-order',
    templateUrl: './create-purchase-order.component.html',
    styleUrls: ['./create-purchase-order.component.scss'],
})
export class CreatePurchaseOrderComponent implements OnInit, AfterViewInit {
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
    listCustomer: any;
    constructor(
        private dataService: DataService,
        private dialog: MatDialog,
        private fb: FormBuilder,
        private purchaseOrder: PurchaseOrderService,
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
            status: [null],
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
        this.purchaseOrder
            .searchCustomer({
                keyword: '',
                page: 1,
                pageSize: 1000,
            })
            .subscribe((data) => {
                this.listCustomer = data.data;
            });
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
        });
    }

    create() {
        const body = {
            // purchaseOrderId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            orderDate: moment(this.createForm.get('orderDate')?.value).format('YYYY-MM-DD'),
            groupId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            orderEmployeeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            warehouseId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            customerId: this.createForm.get('customer.customerId')?.value,
            routeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            type: 0,
            status: this.createForm.get('status')?.value,
            paymentMethod: 0,
            description: this.createForm.get('description')?.value,
            phone: this.createForm.get('customer.phone')?.value,
            address: this.createForm.get('customer.address')?.value,
            customerName: this.createForm.get('customer.customerName')?.value,
            totalAmount: 0,
            totalOfVAT: 0,
            totalDiscountProduct: 0,
            tradeDiscount: 0,
            totalPayment: 0,
            archived: true,
            createdBy: 'string',
            createdDate: '2022-10-14T05:43:01.598Z',
            orderCode: 'string',
            deliveryDate: moment(this.createForm.get('deliveryDate')?.value).format('YYYY-MM-DD'),
            prePayment: 0,
            listProduct: [
                {
                    purchaseOrderId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    productId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    productName: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    unitId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    warehouseId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    unitPrice: 0,
                    quantity: 0,
                    totalPrice: 0,
                    discount: 0,
                    discountRate: 0,
                    note: 'string',
                    type: 0,
                },
            ],
            listPromotionProduct: [
                {
                    purchaseOrderId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    productId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    productName: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    unitId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    warehouseId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    unitPrice: 0,
                    quantity: 0,
                    totalPrice: 0,
                    discount: 0,
                    discountRate: 0,
                    note: 'string',
                    type: 0,
                },
            ],
        };
        console.log(body);
    }

    setInfoCustomer(id: string) {
        let customer = this.listCustomer.filter((customer: any) => {
            return customer.id === id;
        })[0];
        console.log(customer);
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
}
