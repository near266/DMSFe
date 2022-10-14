import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import companies from '../../../mocks/companies';
import status from '../../../mocks/status';
import { Product } from '../../../models/product';
import { ProductDialogService } from '../../../services/product-dialog.service';

@Component({
    selector: 'app-add-product-details',
    templateUrl: './add-product-details.component.html',
    styleUrls: ['./add-product-details.component.scss'],
})
export class AddProductDetailsComponent implements OnInit {
    @Input() productModel: Product | null;
    @Input() status: string;
    @Input() toggleEdit: boolean = false;
    form = new FormGroup({});

    model = {};
    brands = companies;
    statusList = status;
    img: any;
    avt?: any = '../../../../../../assets/images/female.png';
    fields: FormlyFieldConfig[] = [
        {
            key: 'status',
            type: 'product-select',
            templateOptions: {
                label: 'Trạng thái',
                placeholder: 'Trạng thái',
                required: true,
                options: status,
            },
            expressionProperties: {
                'templateOptions.disabled': () => !!this.productModel && !this.toggleEdit,
            },
        },
        {
            key: 'index',
            type: 'product-input',
            templateOptions: {
                label: 'Số thứ tự',
                placeholder: 'Nhập số thứ tự',
            },
            expressionProperties: {
                'templateOptions.disabled': () => !!this.productModel,
            },
        },
        {
            key: 'brandID',
            type: 'product-select',

            templateOptions: {
                label: 'Nhãn hiệu',
                options: companies,
            },
            expressionProperties: {
                'templateOptions.disabled': () => !!this.productModel,
            },
        },
        {
            key: 'SKU',
            type: 'product-input',
            templateOptions: {
                label: 'Mã sản phẩm',
                placeholder: 'Nhập mã sản phẩm',
            },
            expressionProperties: {
                'templateOptions.disabled': () => !!this.productModel,
            },
            hooks: {
                onInit: (field: FormlyFieldConfig) => {
                    field.formControl?.valueChanges.subscribe((value) => {
                        this.productDialogService.changeHeader(value);
                    });
                },
            },
        },
        {
            key: 'productName',
            type: 'product-input',
            templateOptions: {
                label: 'Tên sản phẩm',
                placeholder: 'Nhập tên sản phẩm',
                required: true,
            },
            expressionProperties: {
                'templateOptions.disabled': () => !!this.productModel,
            },
        },
        {
            key: 'sectorId',
            type: 'product-select',
            templateOptions: {
                label: 'Ngành hàng',
                options: companies,
            },
            expressionProperties: {
                'templateOptions.disabled': () => !!this.productModel,
            },
        },
        {
            key: 'supplierId',
            type: 'product-select',
            templateOptions: {
                label: 'Nhà cung cấp',
                required: true,
                options: companies,
            },
            expressionProperties: {
                'templateOptions.disabled': () => !!this.productModel,
            },
        },
        {
            key: 'unitId',
            type: 'product-select',
            templateOptions: {
                label: 'ĐVT chẵn',
                options: companies,
            },
            expressionProperties: {
                'templateOptions.disabled': () => !!this.productModel,
            },
        },
        {
            key: 'unitId2',
            type: 'product-select',
            templateOptions: {
                label: 'ĐVT lẻ',
                options: companies,
            },
            expressionProperties: {
                'templateOptions.disabled': () => !!this.productModel,
            },
        },
        {
            key: 'conversionNumber',
            type: 'product-input',
            templateOptions: {
                label: 'Hệ số quy đổi',
                placeholder: 'Nhập hệ số',
            },
            expressionProperties: {
                'templateOptions.disabled': () => !!this.productModel,
            },
        },
        {
            key: 'inventoryWarning',
            type: 'product-input',
            templateOptions: {
                label: 'Cảnh báo tồn kho',
                placeholder: 'Nhập số ',
            },
            expressionProperties: {
                'templateOptions.disabled': () => !!this.productModel,
            },
        },
        {
            key: 'importPrice',
            type: 'product-input',
            templateOptions: {
                label: 'Giá nhập',
                placeholder: 'Nhập giá',
            },
            expressionProperties: {
                'templateOptions.disabled': () => !!this.productModel,
            },
        },
        {
            key: 'importRetailPrice',
            type: 'product-input',
            templateOptions: {
                label: 'Giá nhập lẻ',
                placeholder: 'Nhập giá',
            },
            expressionProperties: {
                'templateOptions.disabled': () => !!this.productModel,
            },
        },
        {
            key: 'price',
            type: 'product-input',
            templateOptions: {
                label: 'Giá',
                placeholder: 'Nhập giá',
            },
            expressionProperties: {
                'templateOptions.disabled': () => !!this.productModel,
            },
        },
        {
            key: 'retailPrice',
            type: 'product-input',
            templateOptions: {
                label: 'Giá bán lẻ',
                placeholder: 'Nhập giá',
            },
            expressionProperties: {
                'templateOptions.disabled': () => !!this.productModel,
            },
        },
        {
            key: 'VAT',
            type: 'product-select',
            templateOptions: {
                label: 'Thuế VAT',
                options: [
                    { value: '5', label: '5%' },
                    { value: '10', label: '10%' },
                ],
            },
            expressionProperties: {
                'templateOptions.disabled': () => !!this.productModel,
            },
        },
        {
            key: 'image',
            type: 'product-input',
            templateOptions: {
                label: 'Hình ảnh',
                placeholder: 'Nhập link hình ảnh',
            },
            expressionProperties: {
                'templateOptions.disabled': () => !!this.productModel,
            },
        },
        {
            key: 'productDescription',
            type: 'product-input',
            templateOptions: {
                label: 'Mô tả',
                placeholder: 'Nhập mô tả',
            },
            expressionProperties: {
                'templateOptions.disabled': () => !!this.productModel,
            },
        },
        {
            key: 'revenueAcc',
            type: 'product-input',
            templateOptions: {
                label: 'Tài khoản doanh thu',
                placeholder: 'Nhập tài khoản',
            },
            expressionProperties: {
                'templateOptions.disabled': () => !!this.productModel,
            },
        },
        {
            key: 'warehouseAcc',
            type: 'product-input',
            templateOptions: {
                label: 'Tài khoản kho',
                placeholder: 'Nhập tài khoản',
            },
            expressionProperties: {
                'templateOptions.disabled': () => !!this.productModel,
            },
        },
        {
            key: 'priceAcc',
            type: 'product-input',
            templateOptions: {
                label: 'Tài khoản giá vốn',
                placeholder: 'Nhập tài khoản',
            },
            expressionProperties: {
                'templateOptions.disabled': () => !!this.productModel,
            },
        },
    ];

    onSubmit(model: any) {
        console.log(model);
    }
    constructor(private productDialogService: ProductDialogService) {}

    ngOnInit(): void {
        this.productDialogService.changeHeader('');
        if (this.productModel) {
            this.productDialogService.changeHeader(this.productModel.SKU || '');
        }
    }
    uploadFile($event: any) {
        let file = $event.target.files;
        let reader = new FileReader();
        reader.readAsDataURL(file[0]);
        reader.onload = (_event) => {
            const img_obj = {
                data: reader.result,
                id: 1,
                name: file[0].name,
            };
            this.img = img_obj;
            this.avt = img_obj.data;
        };
    }

    deleteImage() {
        this.avt = '../../../../../../assets/images/female.png';
    }
}
