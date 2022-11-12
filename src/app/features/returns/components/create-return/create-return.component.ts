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
    totalPrice: number;
    textMoney: string;
    discountAmount: number;

    // TODO : add search product, add product to products$, both
    selectedCar: number;

    cars = [
        { id: 1, name: 'Volvo' },
        { id: 2, name: 'Saab' },
        { id: 3, name: 'Opel' },
        { id: 4, name: 'Audi' },
    ];
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
    openDialogProduct(type: string) {
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
                if (type === 'products') {
                    this.returnFormService.products$.next(data);
                } else {
                    this.returnFormService.promotionProducts$.next(data);
                }
            });
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
