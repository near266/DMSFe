import { AfterViewInit, Component, Inject, OnInit, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { SaleReceiptService } from 'src/app/core/services/saleReceipt.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { NumberToTextService } from 'src/app/core/shared/services/number-to-text.service';
import { ProductListComponent } from 'src/app/features/orders-mgm/components/product-list/product-list.component';

@Component({
    selector: 'app-gen-return-order',
    templateUrl: './gen-return-order.component.html',
    styleUrls: ['./gen-return-order.component.scss'],
})
export class GenReturnOrderComponent implements OnInit, AfterViewInit, DoCheck {
    statusList = ['Chờ duyệt', 'Đã duyệt', 'Đã giao hàng'];
    groupCites = ['Hà Nội', 'TP Hồ Chí Minh', 'Đà Nẵng'];
    listEmployees: any = [];
    listCustomer: any = [];
    listStatus = [
        {
            value: 0,
            name: 'Chờ duyệt',
        },
        {
            value: 1,
            name: 'Đã duyệt',
        },
    ];
    genReturnForm: FormGroup;
    saleReceipt: any;
    listProduct: any = [];

    totalAmount: number = 0;
    totalDiscountProduct: number = 0;
    tradeDiscount: number = 0;
    totalPayment: number = 0;
    prePayment: number = 0;
    totalOfVAT: number = 0;
    textMoney: any;
    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<GenReturnOrderComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private purchaseOrder: PurchaseOrderService,
        private fb: FormBuilder,
        private snackbar: SnackbarService,
        private saleReceiptSerivce: SaleReceiptService,
        private numberToText: NumberToTextService,
    ) {}

    ngOnInit(): void {
        this.saleReceipt = this.data;
        this.listProduct = this.data.listProduct;
        console.log(this.data);
        this.genReturnForm = this.fb.group({
            saleCode: [null],
            orderDate: [null],
            orderEmployee: [null],
            customerId: [null],
            name: [null],
            address: [null],
            phone: [null],
            description: [null],
            groupId: [null],
            status: [0],
            returnDate: [null],
        });
    }

    ngAfterViewInit(): void {
        this.getListCustomer();
        this.getListEmployees();
        setTimeout(() => {
            this.patchValue();
            // get all info payment
            this.totalAmount = this.data.totalAmount;
            this.totalDiscountProduct = this.data.totalDiscountProduct;
            this.tradeDiscount = this.data.tradeDiscount;
            this.totalPayment = this.data.totalPayment;
            this.prePayment = this.data.prePayment;
            this.textMoney = this.numberToText.doc(this.totalPayment);
        }, 0);
    }

    ngDoCheck(): void {
        // count totalAmount (Tổng tiền hàng)
        this.countTotalAmount();
        // count totalDiscountProduct (Chiết khấu sản phẩm)
        this.countTotalDiscountProduct();
        // count totalPayment
        this.countTotalPayment();
        // number to text
        this.textMoney = this.numberToText.doc(this.totalPayment);
    }

    discountRate(product: any) {
        product.discountRate = product.discount / product.totalPrice;
    }

    countTotalAmount() {
        this.totalAmount = 0;
        this.listProduct.forEach((product: any) => {
            if (product.totalPrice) {
                this.totalAmount += product.totalPrice;
            }
        });
    }

    countTotalDiscountProduct() {
        this.totalDiscountProduct = 0;
        this.listProduct.forEach((product: any) => {
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

    patchValue() {
        let description = `${this.saleReceipt.description} (Trả hàng theo đơn bán số ${this.saleReceipt.saleCode})`;
        this.genReturnForm.patchValue({
            saleCode: this.saleReceipt.saleCode,
            orderDate: this.saleReceipt.orderDate,
            orderEmployee: this.saleReceipt.orderEmployee?.id,
            customerId: this.saleReceipt.customer?.id,
            name: this.saleReceipt.customerName,
            address: this.saleReceipt.address,
            phone: this.saleReceipt.phone,
            description: description,
            groupId: this.saleReceipt.group?.id,
        });
    }

    getListCustomer() {
        this.purchaseOrder
            .searchCustomer({ keyword: '', page: 1, pageSize: 1000 })
            .subscribe((data) => (this.listCustomer = data.data));
    }

    getListEmployees() {
        this.purchaseOrder.getAllEmployees('', 1, 1000).subscribe((data) => {
            this.listEmployees = data.data;
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

    save() {
        // this.dialogRef.close('Lưu');
        // gen productList match form
        let listProduct = this.listProduct.map((product: any) => {
            return {
                productId: product.product.id,
                unitId: product.unit.id,
                warehouseId: product.warehouse.id,
                unitPrice: product.unitPrice,
                quantity: product.quantity,
                totalPrice: product.totalPrice,
                discount: product.discount,
                discountRate: product.discountRate,
                note: product.note,
                type: product.type,
            };
        });
        const body = {
            // id: this.data.id,
            orderDate: moment(this.genReturnForm.get('orderDate')?.value).format('YYYY-MM-DD'),
            groupId: this.genReturnForm.get('groupId')?.value,
            orderEmployeeId: this.genReturnForm.get('orderEmployee')?.value,
            warehouseId: null, // không cần truyền cũng được
            customerId: this.genReturnForm.get('customerId')?.value,
            type: 0,
            status: this.genReturnForm.get('status')?.value,
            description: this.genReturnForm.get('description')?.value,
            phone: this.genReturnForm.get('phone')?.value,
            address: this.genReturnForm.get('address')?.value,
            customerName: this.genReturnForm.get('name')?.value,
            totalAmount: this.totalAmount,
            totalOfVAT: this.totalOfVAT,
            totalDiscountProduct: this.totalDiscountProduct,
            tradeDiscount: this.tradeDiscount,
            totalPayment: this.totalPayment,
            // createdBy: 'string',
            // createdDate: '2022-10-18T03:03:58.348Z',
            // returnCode: 'string',
            purchaseOrderId: this.data.id,
            returnDate: this.genReturnForm.get('returnDate')?.value,
            listProduct: listProduct,
        };
        this.saleReceiptSerivce.createReturnOrder(body).subscribe(
            (data: any) => {},
            (err: any) => {
                this.snackbar.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'bottom', false);
            },
            () => {
                this.snackbar.openSnackbar('Thêm mới đơn trả thành công', 2000, 'Đóng', 'center', 'bottom', true);
                this.dialogRef.close('Lưu');
            },
        );
    }

    letProductListSendAPI() {
        return;
    }
}
