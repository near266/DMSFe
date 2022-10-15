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
    ngDoCheck(): void {}
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
                discount: product.discount,
                discountRate: product.discountRate * 100000,
                note: product.note,
                type: 0,
            };
        });
        console.log(lastListChoosen);
        const body = {
            orderDate: moment(this.createForm.get('orderDate')?.value).format('YYYY-MM-DD'),
            // groupId: this.createForm.get('groupId')?.value, // Chưa có api get
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
            prePayment: 0,
            totalAmount: 0,
            totalOfVAT: 0,
            totalDiscountProduct: 0,
            tradeDiscount: 0,
            totalPayment: 0,
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
}
