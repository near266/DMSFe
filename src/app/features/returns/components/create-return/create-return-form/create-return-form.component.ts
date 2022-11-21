import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyField, FormlyFieldConfig } from '@ngx-formly/core';
import { of, switchMap, tap } from 'rxjs';
import { Status } from '../../../models/return';
import * as moment from 'moment';
import { ReturnFormService } from '../../../services/return-form.service';

@Component({
    selector: 'app-create-return-form',
    templateUrl: './create-return-form.component.html',
    styleUrls: ['./create-return-form.component.scss'],
})
export class CreateReturnFormComponent implements OnInit {
    formValues = [];
    products: any[] = [];
    promotionProducts: any[] = [];
    form = new FormGroup({});
    fields: FormlyFieldConfig[] = [
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
                    key: 'orderId',
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
                    type: 'autocomplete-formly',
                    className: 'flex-1',
                    defaultValue: null,
                    templateOptions: {
                        label: 'Mã khách hàng',
                        placeholder: 'Mã khách hàng',
                        required: true,
                        appearance: 'outline',
                        valueProp: (option: any) => option,
                        compareWith: (o1: any, o2: any) => o1.value === o2.value,
                        options: this.returnFormService.getAllCustomers(),
                        change: (field: FormlyFieldConfig, $event: any) => {
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
                        required: true,
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
                    key: 'groupId',
                    type: 'select',
                    templateOptions: {
                        label: 'Phòng, nhóm',
                        options: this.returnFormService.getGroupsAndFilter(),
                        type: 'select',
                        required: true,
                        // disabled: true,
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

                        // options: this.returnFormService.getEmployees(),
                        // options: [],
                        required: true,

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
                        required: true,

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
                        label: 'Ngày trả hàng',
                        required: true,

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
                        label: 'Khách hàng',
                        placeholder: 'Khách hàng',
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
    constructor(private returnFormService: ReturnFormService) {}

    ngOnInit(): void {
        // TODO: remove id
        // this.returnFormService.formValues$.subscribe((formValues) => {
        //     this.form.patchValue({
        //         ...formValues,
        //         description: `Trả hàng từ phiếu bán hàng [${formValues.orderCode}]`,
        //     });
        //     formValues.listProduct.forEach((item: any) => {
        //         this.products.push({
        //             productId: item.product?.id,
        //             unitId: item.unit?.id,
        //             warehouseId: item.warehouse?.id,
        //             unitPrice: item.unitPrice || 0,
        //             quantity: item.quantity,
        //             totalPrice: item.totalPrice || 0,
        //             discount: item.discount || 0,
        //             discountRate: item.discountRate || 0,
        //             note: item.note,
        //             type: item.type || 0,
        //         });
        //     });
        //     formValues.listPromotionProduct.forEach((item: any) => {
        //         this.promotionProducts.push({
        //             productId: item.product?.id,
        //             unitId: item.unit?.id,
        //             warehouseId: item.warehouse?.id,
        //             unitPrice: item.unitPrice || 0,
        //             quantity: item.quantity,
        //             totalPrice: item.totalPrice || 0,
        //             discount: item.discount || 0,
        //             discountRate: item.discountRate || 0,
        //             note: item.note,
        //             type: item.type || 0,
        //         });
        //     });
        // });
        this.returnFormService.getAllCustomers().subscribe((result) => {
            console.log(result);
        });
        this.returnFormService.submitInfoForm$.subscribe((listProduct) => {
            this.form.markAllAsTouched();
            if (this.form.valid) {
                const form = {
                    ...this.form.value,
                    customerCode: this.form.value.customerCode.label,
                    customerId: this.form.value.customerCode.value,
                    ...listProduct.listProduct,
                    listPromotionProduct: listProduct.listPromotionProduct,
                    orderDate: moment(this.form.value.orderDate).format('YYYY-MM-DD'),
                    returnDate: moment(this.form.value.returnDate).format('YYYY-MM-DD'),
                };
                this.returnFormService.addNewReturn(form);
            }
        });
    }
    submit() {
        const form = {
            ...this.form.value,
            orderDate: moment(this.form.value.orderDate).format('YYYY-MM-DD'),
            returnDate: moment(this.form.value.returnDate).format('YYYY-MM-DD'),
            listProduct: this.products,
            listProductDiscount: this.promotionProducts,
        };
        delete form.id;
        this.returnFormService.addNewReturn(form);
    }
}
