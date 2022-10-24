import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import * as moment from 'moment';
import { map, Subscription, switchMap, tap } from 'rxjs';
import { ComponentMode } from 'src/app/features/returns/models/componentMode';
import { Status } from 'src/app/features/returns/models/return';
import { ReturnDetailsService } from 'src/app/features/returns/services/return-details.service';
import { ReturnFormService } from 'src/app/features/returns/services/return-form.service';

@Component({
    selector: 'app-detail-return-info',
    templateUrl: './detail-return-info.component.html',
    styleUrls: ['./detail-return-info.component.scss'],
})
export class DetailReturnInfoComponent implements OnInit {
    private subscription: Subscription[] = [];
    disableField: boolean = true;
    constructor(private returnFormService: ReturnFormService, private returnDetailsService: ReturnDetailsService) {
        this.form.disable();
    }
    form = new FormGroup({});
    fields: FormlyFieldConfig[] = [
        { key: 'id' },
        {
            key: 'customerId',
        },
        {
            key: 'type',
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
                    templateOptions: {
                        label: 'Mã phiếu bán',
                        placeholder: 'Mã phiếu bán',
                        disabled: true,
                        appearance: 'outline',
                        // options: status,
                    },
                },
                {
                    key: 'customerCode',
                    // type: 'product-select',
                    type: 'select',
                    className: 'flex-1',
                    defaultValue: null,
                    templateOptions: {
                        label: 'Mã khách hàng',
                        placeholder: 'Mã khách hàng',
                        disabled: true,
                        appearance: 'outline',
                        valueProp: (option: any) => option,
                        compareWith: (o1: any, o2: any) => o1.value === o2.value,
                        options: this.returnFormService.getAllCustomers(),
                        change: (field, $event) => {
                            field.form!.get('customerName')?.setValue(field!.formControl!.value.customerName);
                            field.form!.get('address')?.setValue(field!.formControl!.value.address);
                            field.form!.get('phone')?.setValue(field!.formControl!.value.phone);
                        },
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
                    hooks: {
                        onInit: (field: FormlyFieldConfig) => {
                            field.form?.get('customerCode')?.valueChanges.pipe(
                                tap((customerId) => {
                                    field.formControl?.setValue(
                                        this.returnFormService.filterCustomerById(customerId).subscribe((result) => {
                                            console.log(result);
                                        }),
                                    );
                                }),
                            );
                        },
                    },
                },
            ],
        },
        {
            fieldGroupClassName: 'flex space-x-4 max-w-[1000px] text-[12px]',
            fieldGroup: [
                {
                    className: 'flex-1 ',
                    defaultValue: null,
                    key: 'groupId',
                    type: 'select',
                    templateOptions: {
                        label: 'Phòng, nhóm',
                        options: this.returnFormService.getGroupsAndFilter(),
                        type: 'select',
                        disabled: true,
                        appearance: 'outline',
                        // options: status,
                    },
                },
                {
                    key: 'orderEmployeeId',
                    // type: 'product-select',
                    className: 'flex-1',
                    type: 'select',
                    defaultValue: null,
                    templateOptions: {
                        label: 'Nhân viên đặt',
                        disabled: true,
                        // options: this.returnFormService.getEmployees(),
                        // options: [],
                        appearance: 'outline',
                        // options: this.productDialogService.getAllBrands(),
                    },
                    // Code bên dưới sử dụng khi có sự phụ thuộc của nhóm và nhân viên.
                    hooks: {
                        onInit: (field: FormlyFieldConfig) => {
                            field.props!.options = field.form?.get('groupId')?.valueChanges.pipe(
                                switchMap((groupId) => {
                                    return this.returnFormService.getEmployeesByGroupId(groupId).pipe(
                                        tap((data) => {
                                            if (data.length) {
                                                console.log(data);
                                                field.formControl?.setValue(data[0].value);
                                            }
                                        }),
                                    );
                                }),
                            );
                        },
                    },
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
                    expressions: {
                        'templateOptions.disabled': this.returnDetailsService.currentMode$.pipe(
                            map((reponse: any) => reponse === ComponentMode.VIEW),
                        ),
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
                    expressions: {
                        'templateOptions.disabled': this.returnDetailsService.currentMode$.pipe(
                            map((reponse: any) => reponse === ComponentMode.VIEW),
                        ),
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
                    expressions: {
                        'templateOptions.disabled': this.returnDetailsService.currentMode$.pipe(
                            map((reponse: any) => reponse === ComponentMode.VIEW),
                        ),
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
                    expressions: {
                        'templateOptions.disabled': this.returnDetailsService.currentMode$.pipe(
                            map((reponse: any) => reponse === ComponentMode.VIEW),
                        ),
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
                    expressions: {
                        'templateOptions.disabled': this.returnDetailsService.currentMode$.pipe(
                            map((reponse: any) => reponse === ComponentMode.VIEW),
                        ),
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
            this.returnDetailsService.returnDetails$.subscribe((_) => {
                console.log(_);
                this.form.patchValue(_);
            }),
            this.returnDetailsService.currentMode$.subscribe((mode) => {
                console.log(123);
                this.disableField = mode === ComponentMode.VIEW;
            }),
            this.returnDetailsService.updateReturnInfo$.subscribe((value: any) => {
                if (value) {
                    this.form.markAllAsTouched();

                    if (this.form.valid) {
                        const form = {
                            ...this.form.getRawValue(),
                            customerId: this.form.getRawValue().customerCode?.value,
                            orderDate: moment(this.form.value.orderDate).format('YYYY-MM-DD'),
                            returnDate: moment(this.form.value.returnDate).format('YYYY-MM-DD'),
                            totalOfVAT: 0,
                            totalDiscountProduct: 0,
                            tradeDiscount: 0,
                            status: value?.status || this.form.value.status,
                            totalPayment: value.totalPayment,
                        };
                        delete form.customerCode;
                        this.returnFormService.updateReturn(form);
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
