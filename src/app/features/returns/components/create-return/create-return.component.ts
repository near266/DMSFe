import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { Product } from '../../../product/models/product';
import { DataService } from 'src/app/core/services/data.service';
import { readMoney } from 'src/app/core/shared/utils/readMoney';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { ProductListComponent } from 'src/app/features/orders-mgm/components/product-list/product-list.component';
import { ReturnFormService } from '../../services/return-form.service';

@Component({
    selector: 'app-create-return',
    templateUrl: './create-return.component.html',
    styleUrls: ['./create-return.component.scss'],
})
export class CreateReturnComponent implements OnInit {
    formValues: any;
    totalPrice: number;
    productsInput: any;
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
    createForm: FormGroup;
    listCustomer: any;
    products: any;
    textMoney: string;
    discountAmount: number;
    constructor(
        private dataService: DataService,
        private dialog: MatDialog,
        private fb: FormBuilder,
        private returnFormService: ReturnFormService,
    ) {}

    ngOnInit(): void {
        this.returnFormService.totalPrice$.subscribe((data) => {
            this.totalPrice = data;
            const ins = new readMoney(data);
            this.textMoney = ins.doc(data - this.discountAmount);
        });
        this.returnFormService.discountAmount$.subscribe((data) => {
            this.discountAmount = data;
            const ins = new readMoney(data);
            this.textMoney = ins.doc(this.totalPrice - data);
        });
    }
    submitForms(): void {
        this.returnFormService.submitForms();
    }

    stopPropagation(e: any) {
        e.stopPropagation();
    }
    passingDataFrom() {
        this.dataService.openProductList('create', 'Đây là tạo sản phẩm');
    }
    openDialogProduct() {
        const dialogRef = this.dialog
            .open(ProductListComponent, {
                maxWidth: '100vw',
                maxHeight: '100vh',
                height: '100%',
                width: '100%',
                panelClass: 'full-screen-modal',
            })
            .afterClosed()
            .subscribe((data) => {
                this.returnFormService.products$.next(data);
            });
    }

    // create() {
    //     const body = {
    //         // purchaseOrderId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    //         orderDate: moment(this.createForm.get('orderDate')?.value).format('YYYY-MM-DD'),
    //         groupId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    //         orderEmployeeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    //         warehouseId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    //         customerId: this.createForm.get('customer.customerId')?.value,
    //         routeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    //         type: 0,
    //         status: this.createForm.get('status')?.value,
    //         paymentMethod: 0,
    //         description: this.createForm.get('description')?.value,
    //         phone: this.createForm.get('customer.phone')?.value,
    //         address: this.createForm.get('customer.address')?.value,
    //         customerName: this.createForm.get('customer.customerName')?.value,
    //         totalAmount: 0,
    //         totalOfVAT: 0,
    //         totalDiscountProduct: 0,
    //         tradeDiscount: 0,
    //         totalPayment: 0,
    //         archived: true,
    //         createdBy: 'string',
    //         createdDate: '2022-10-14T05:43:01.598Z',
    //         orderCode: 'string',
    //         deliveryDate: moment(this.createForm.get('deliveryDate')?.value).format('YYYY-MM-DD'),
    //         prePayment: 0,
    //         listProduct: [
    //             {
    //                 purchaseOrderId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    //                 productId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    //                 productName: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    //                 unitId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    //                 warehouseId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    //                 unitPrice: 0,
    //                 quantity: 0,
    //                 totalPrice: 0,
    //                 discount: 0,
    //                 discountRate: 0,
    //                 note: 'string',
    //                 type: 0,
    //             },
    //         ],
    //         listPromotionProduct: [
    //             {
    //                 purchaseOrderId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    //                 productId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    //                 productName: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    //                 unitId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    //                 warehouseId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    //                 unitPrice: 0,
    //                 quantity: 0,
    //                 totalPrice: 0,
    //                 discount: 0,
    //                 discountRate: 0,
    //                 note: 'string',
    //                 type: 0,
    //             },
    //         ],
    //     };
    //     console.log(body);
    // }

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
