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
    listProduct: any = [];
    listPromotionProduct?: ListPromotionProduct[] = [];
    subscription: Subscription[] = [];
    id: string;
    listCustomer: any = [];
    listEmployee: any = [];
    constructor(
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private dataservice: DataService,
        private dialog: MatDialog,
        private router: Router,
        private dataService: DataService,
        private purchaseOrder: PurchaseOrderService,
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
        // get body Update
        this.purchaseOrder.updateOrder.subscribe((data) => console.log(data));
    }

    getDetail() {
        this.purchaseOrder.detail(this.id).subscribe((data) => {
            this.detailOrder = data;
            console.log(this.detailOrder);
            this.patchValue();
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
        console.log(this.listProduct);
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

    getListCustomer() {
        this.purchaseOrder.searchCustomer({ keyword: '', page: 1, pageSize: 1000 }).subscribe((data: any) => {
            this.listCustomer = data.data;
            console.log(typeof this.listCustomer);
            console.log(this.listCustomer);
        });
    }

    getListEmployee() {
        this.purchaseOrder.getAllEmployees(1, 1000).subscribe((data) => {
            this.listEmployee = data.data;
        });
    }

    ngDoCheck(): void {}

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
}
