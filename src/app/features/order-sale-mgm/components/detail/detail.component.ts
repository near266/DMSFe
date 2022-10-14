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
    detailOrderFakeData: any = [];
    listProduct?: ListProduct[] = [];
    listPromotionProduct?: ListPromotionProduct[] = [];
    subscription: Subscription[] = [];
    id: string;
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
    listEmployee = [
        {
            employeeId: '1',
            employeeName: 'Nguyễn Văn Tuấn',
        },
        {
            employeeId: '2',
            employeeName: 'Đặng Xuân Khu',
        },
        {
            employeeId: '3',
            employeeName: 'Hồ Tuấn Anh',
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
    constructor(
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private dataservice: DataService,
        private dialog: MatDialog,
        private saleReceipt: SaleReceiptService,
    ) {}

    ngOnInit(): void {
        // pass id to service
        this.subscription.push(
            this.activatedRoute.params.subscribe((params) => {
                this.id = params['id'];
                this.saleReceipt.passId(params['id']);
            }),
        );
        // create Form
        this.detailOrderForm = this.fb.group({
            saleReceiptCode: [''],
            orderDate: [''],
            saleDate: [''],
            saleEmployee: [''],
            deliveryDate: [''],
            group: [''],
            orderEmployee: [''],
            route: [''],
            customerCode: [''],
            customerName: [''],
            phone: [''],
            address: [''],
            description: [''],
            debtLimit: [''],
            debtCurrent: [''],
            paymentMethod: [''],
            totalAmount: [''],
            totalOfVAT: [''],
            totalDiscountProduct: [''],
            tradeDiscount: [''],
            totalPayment: [''],
            prePayment: [''],
            status: [''],
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
    }

    getDetail() {
        this.saleReceipt.searchById(this.id).subscribe((data) => {
            this.detailOrderFakeData = data;
            console.log(data);
            this.patchValue();
        });
    }

    patchValue() {
        // push if have relatedPurchaseOrder
        if (this.detailOrderFakeData.relatedOrder.purchaseOrderCode) {
            this.detailOrderFakeData.description += `  - Bán hàng theo phiếu đặt hàng số [${this.detailOrderFakeData.relatedOrder.purchaseOrderCode}]`;
        }
        this.detailOrderForm.patchValue({
            saleReceiptCode: this.detailOrderFakeData.saleReceiptCode,
            orderDate: this.detailOrderFakeData.orderDate,
            saleDate: this.detailOrderFakeData.saleDate,
            deliveryDate: this.detailOrderFakeData.deliveryDate,
            group: this.detailOrderFakeData.group?.groupId,
            orderEmployee: this.detailOrderFakeData.orderEmployee?.employeeId,
            route: this.detailOrderFakeData.route?.routeId,
            customerCode: this.detailOrderFakeData.customerCode,
            customerName: this.detailOrderFakeData.customerName,
            phone: this.detailOrderFakeData.phone,
            address: this.detailOrderFakeData.address,
            description: this.detailOrderFakeData.description,
            status: this.detailOrderFakeData.status,
        });
        this.listProduct = this.detailOrderFakeData.listProduct;
        this.listPromotionProduct = this.detailOrderFakeData.listPromotionProduct;
    }

    ngOnDestroy(): void {
        this.subscription.forEach((service) => {
            service.unsubscribe();
        });
    }

    ngAfterViewInit(): void {
        this.subscription.push(
            this.saleReceipt.id.subscribe((data) => {
                this.id = data;
                if (this.id) {
                    this.getDetail();
                }
            }),
        );
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