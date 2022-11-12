import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { FormlyFieldConfig } from '@ngx-formly/core';
import * as moment from 'moment';
import { debounce, Subscription, switchMap, tap, timer } from 'rxjs';
import { Status } from 'src/app/features/returns/models/return';
import { ReturnFormService } from 'src/app/features/returns/services/return-form.service';
import { ReturnOrderService } from 'src/app/features/returns/services/return-order.service';

@Component({
    selector: 'app-return-order-info',
    templateUrl: './return-order-info.component.html',
    styleUrls: ['./return-order-info.component.scss'],
})
export class ReturnOrderInfoComponent implements OnInit {
    private subscription: Subscription[] = [];
    disableField: boolean = false;
    constructor(private returnFormService: ReturnFormService, private returnDetailsService: ReturnOrderService) {}
    form = new FormGroup({});
    fields: FormlyFieldConfig[] = [
        { key: 'id' },
        {
            key: 'customerId',
        },
        {
            key: 'groupId',
        },
        {
            key: 'orderEmployeeId',
        },
        {
            key: 'type',
        },
        {
            key: 'saleRecieptId',
        },
        {
            key: 'warehouseId',
        },
        {
            fieldGroupClassName: 'flex space-x-4 max-w-[1000px] text-[12px]',
            fieldGroup: [
                {
                    className: 'flex-1 ',
                    key: 'saleCode',
                    type: 'input',
                    defaultValue: null,
                    templateOptions: {
                        label: 'Mã phiếu bán',
                        disabled: true,
                        placeholder: 'Mã phiếu bán',
                        appearance: 'outline',
                        // options: status,
                    },
                },
                {
                    key: 'customerCode',
                    // type: 'product-select',
                    type: 'input',
                    className: 'flex-1',
                    defaultValue: null,
                    templateOptions: {
                        label: 'Mã khách hàng',
                        placeholder: 'Mã khách hàng',
                        disabled: true,
                        appearance: 'outline',
                    },
                },
                {
                    key: 'customerName',
                    // type: 'product-select',
                    type: 'input',
                    className: 'flex-1',
                    defaultValue: null,
                    templateOptions: {
                        label: 'Khách hàng',
                        placeholder: 'Khách hàng',
                        disabled: true,
                        // disabled: true,
                        appearance: 'outline',
                        // options: this.productDialogService.getAllBrands(),
                    },
                },
            ],
        },
        {
            fieldGroupClassName: 'flex space-x-4 max-w-[1000px] text-[12px]',
            fieldGroup: [
                {
                    className: 'flex-1 ',
                    type: 'input',

                    defaultValue: null,
                    key: 'groupName',
                    templateOptions: {
                        label: 'Phòng, nhóm',
                        disabled: true,
                        appearance: 'outline',
                        // options: status,
                    },
                },
                {
                    key: 'orderEmployeeName',
                    // type: 'product-select',
                    type: 'input',
                    className: 'flex-1',
                    defaultValue: null,
                    templateOptions: {
                        label: 'Nhân viên đặt',
                        disabled: true,

                        appearance: 'outline',
                        // options: this.productDialogService.getAllBrands(),
                    },
                    // Code bên dưới sử dụng khi có sự phụ thuộc của nhóm và nhân viên.
                },
                {
                    key: 'orderDate',
                    // type: 'product-select',
                    type: 'datepicker',
                    className: 'flex-1',
                    defaultValue: null,
                    templateOptions: {
                        label: 'Ngày đặt hàng',
                        required: true,
                        disabled: true,
                        appearance: 'outline',
                        // options: this.productDialogService.getAllBrands(),
                    },
                },
            ],
        },
        {
            fieldGroupClassName: 'flex space-x-4 max-w-[1000px] text-[12px]',
            fieldGroup: [
                {
                    className: 'flex-2',
                    key: 'phone',
                    type: 'input',
                    templateOptions: {
                        type: 'phoneNumber',
                        label: 'Số điện thoại',
                        appearance: 'outline',
                        // options: status,
                    },
                },
                {
                    key: 'address',
                    // type: 'product-select',
                    className: 'flex-1',
                    type: 'input',
                    defaultValue: null,
                    templateOptions: {
                        label: 'Địa chỉ',
                        appearance: 'outline',
                        // options: this.productDialogService.getAllBrands(),
                    },
                },
            ],
        },
        {
            fieldGroupClassName: 'flex space-x-4 max-w-[1000px] text-[12px]',
            fieldGroup: [
                {
                    className: 'flex-1 ',
                    key: 'returnCode',
                    type: 'input',
                    templateOptions: {
                        label: 'Mã phiếu trả',
                        placeholder: 'Mã phiếu trả',
                        appearance: 'outline',
                        disabled: true,
                        // options: status,
                    },
                },
                {
                    key: 'returnDate',
                    // type: 'product-select',
                    type: 'datepicker',
                    className: 'flex-1',
                    defaultValue: null,
                    templateOptions: {
                        required: true,
                        label: 'Ngày trả hàng',
                        appearance: 'outline',
                        // options: this.productDialogService.getAllBrands(),
                    },
                },
                {
                    key: 'status',
                    // type: 'product-select',
                    type: 'select',
                    className: 'flex-1',
                    defaultValue: null,
                    templateOptions: {
                        label: 'Trạng thái',
                        required: true,
                        options: [
                            { value: Status.PENDING, label: 'Chờ Duyệt' },
                            { value: Status.APPROVED, label: 'Đã Duyệt' },
                        ],
                        appearance: 'outline',
                        // options: this.productDialogService.getAllBrands(),
                    },
                },
            ],
        },
        {
            fieldGroupClassName: 'flex space-x-4 max-w-[1000px] text-[12px]',
            fieldGroup: [
                {
                    key: 'description',
                    className: 'flex-1 ',
                    // type: 'product-select',
                    type: 'textarea',
                    defaultValue: null,
                    templateOptions: {
                        rows: 3,
                        autosize: true,
                        label: 'Diễn giải',
                        placeholder: 'Diễn giải',
                        appearance: 'outline',
                        // options: this.productDialogService.getAllBrands(),
                    },
                },
            ],
        },
    ];
    model = {
        id: null,
        orderId: null,
        description: null,
        status: 1,
        address: null,
        phone: null,
        orderDate: null,
        warehouseId: null,
        type: 0,
        orderEmployeeId: null,
        groupId: null,
        customerName: null,
        customerId: null,
        returnDate: new Date(),
        returnCode: null,
    };

    ngOnInit(): void {
        this.subscription.push(
            this.returnDetailsService.returnInfo$.subscribe((_) => {
                setTimeout(() => {
                    this.form.patchValue(_);
                }, 1);
            }),
            this.returnDetailsService.submitFormPromotionList$
                .pipe(debounce(() => timer(100)))
                .subscribe((value: any) => {
                    if (value) {
                        this.form.markAllAsTouched();
                        if (this.form.valid) {
                            const form = {
                                ...this.form.getRawValue(),
                                ...value,
                                customerId: this.form.getRawValue().customerId,
                                orderDate: moment(this.form.value.orderDate).format('YYYY-MM-DD'),
                                returnDate: moment(this.form.value.returnDate).format('YYYY-MM-DD'),
                                totalOfVAT: 0,
                                totalAmount: this.returnDetailsService.totalPrice$.getValue(),
                                totalDiscountProduct: this.returnDetailsService.discountAmount$.getValue(),
                                totalPayment:
                                    this.returnDetailsService.totalPrice$.getValue() -
                                    this.returnDetailsService.discountAmount$.getValue(),
                                tradeDiscount: 0,
                                status: this.form.value.status || 1,
                            };
                            delete form.customerCode;
                            delete form.id;
                            delete form.groupName;
                            delete form.orderEmployeeName;
                            delete form.saleCode;
                            this.returnFormService.addNewReturn(form);
                        }
                        // console.log(this.form.getRawValue());
                    }
                }),
        );
    }
    submit() {
        console.log('123');
    }
    ngOnDestroy() {
        this.subscription.forEach((_) => {
            _.unsubscribe();
        });
    }
}
