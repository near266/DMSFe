import { Component, OnInit, AfterViewInit, Input, DoCheck, OnDestroy } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListProduct, ListPromotionProduct, PurchaseOrder, PurchaseOrderDetail } from 'src/app/core/model/PurchaseOrder';
import { DetailPurchaseOrder } from 'src/app/core/data/PurchaseOrderList';
import { DataService } from 'src/app/core/services/data.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProductListComponent } from '../../product-list/product-list.component';
@Component({
    selector: 'app-detail-order',
    templateUrl: './detail-order.component.html',
    styleUrls: ['./detail-order.component.scss'],
})
export class DetailOrderComponent implements OnInit, AfterViewInit, DoCheck, OnDestroy {
    statusList = [
        {
            value: 0,
            name: 'Chờ duyệt'
        },
        {
            value: 1,
            name: 'Đã duyệt'
        },
        {
            value: 2,
            name: 'Đã xuất hàng'
        },
        {
            value: 3,
            name: 'Đã bán hàng'
        },

    ];
    type: string = 'View';
    detailOrderForm!: FormGroup;
    detailOrderFakeData: PurchaseOrderDetail = DetailPurchaseOrder[0];
    listProduct?: ListProduct[] = [];
    listPromotionProduct?: ListPromotionProduct[] = [];
    subscription!: Subscription;
    listGroup = [
        {
            groupId: '1',
            groupName: 'FT2 - Đông Bắc - QL Tùng (Khu vực Đông Bắc)'
        },
        {
            groupId: '2',
            groupName: 'FT5 - Bắc Miền Trung - QL Trọng (Khu vực Bắc Miền Trung)'
        },
        {
            groupId: '3',
            groupName: 'FT7 - Miền Tây NB - QL Duy'
        }
    ]
    listEmployee = [
        {
            employeeId: '1',
            employeeName: 'Nguyễn Văn Tuấn'
        },
        {
            employeeId: '2',
            employeeName: 'Đặng Xuân Khu'
        },
        {
            employeeId: '3',
            employeeName: 'Hồ Tuấn Anh'
        }
    ]
    listRoute = [
        {
            routeId: '1',
            routeName: 'Nguyễn Văn Tuấn'
        },
        {
            routeId: '2',
            routeName: 'Đặng Xuân Khu'
        },
        {
            routeId: '3',
            routeName: 'Hồ Tuấn Anh'
        }
    ]
    constructor(private route: ActivatedRoute, private fb: FormBuilder, private dataservice: DataService, private dialog: MatDialog) { }

    ngOnInit(): void {
        this.detailOrderForm = this.fb.group({
            purchaseOrderCode: [''],
            status: [''],
            orderDate: [''],
            deliveryDate: [''],
            group: [''],
            orderEmployee: [''],
            route: [''],
            customerCode: [''],
            customerName: [''],
            phone: [''],
            address: [''],
            description: [''],
            listProduct: this.fb.group({
                productCode: [''],
                productName: [''],
                unitName: [''],
                warehouseName: [''],
                quantity: [''],
                unitPrice: [''],
                totalPrice: [''],
                discount: [''],
                discountRate: [''],
                note: ['']
            }),
            listPromotionProduct: this.fb.group({
                productCode: [''],
                productName: [''],
                unitName: [''],
                warehouseName: [''],
                quantity: [''],
                note: ['']
            }),
            debtLimit: [''],
            debtCurrent: [''],
            paymentMethod: [''],
            totalAmount: [''],
            totalOfVAT: [''],
            totalDiscountProduct: [''],
            tradeDiscount: [''],
            totalPayment: [''],
            prePayment: ['']
        })
        this.subscription = this.dataservice.type.subscribe((data: any) => {
            this.type = data;
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.detailOrderForm.patchValue({
                purchaseOrderCode: this.detailOrderFakeData.purchaseOrderCode,
                status: this.detailOrderFakeData.status,
                orderDate: this.detailOrderFakeData.orderDate,
                deliveryDate: this.detailOrderFakeData.deliveryDate,
                group: this.detailOrderFakeData.group?.groupId,
                orderEmployee: this.detailOrderFakeData.orderEmployee?.employeeId,
                route: this.detailOrderFakeData.route?.routeId,
                customerCode: this.detailOrderFakeData.customerCode,
                customerName: this.detailOrderFakeData.customerName,
                phone: this.detailOrderFakeData.phone,
                address: this.detailOrderFakeData.address,
                description: this.detailOrderFakeData.description
            })
            this.listProduct = this.detailOrderFakeData.listProduct;
            this.listPromotionProduct = this.detailOrderFakeData.listPromotionProduct;
        }, 0)

    }

    ngDoCheck(): void {

    }

    stopPropagation(e: any) {
        e.stopPropagation();
    }

    passingDataFrom() {
        this.dataservice.openProductList('update', this.detailOrderFakeData)
    }

    openDialogProduct() {
        const dialogRef = this.dialog.open(ProductListComponent, {
            width: '100vw',
            height: '100vh'
        })
    }
}
