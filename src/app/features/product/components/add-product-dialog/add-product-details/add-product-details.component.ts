import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ProductService } from '../../../services/product.service';
import { Subscription } from 'rxjs';
import { ProductApiService } from '../../../apis/product.api.service';
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
    @ViewChild('myForm') myForm: NgForm;
    @ViewChild('submitButton') submitButton: ElementRef;

    @Input() productModel: Product | null;
    @Input() status: string;
    @Input() dialogMode: 'create' | 'edit' | 'view' = 'create';
    form = new FormGroup({});
    subscription = new Subscription();
    subscription2 = new Subscription();
    model = {
        id: null,
        brandId: null,
        conversionNumber: 0,
        image: null,
        importPrice: 0,
        importRetailPrice: 0,
        inventoryWarning: 0,
        price: 0,
        stt: 0,
        priceAcc: null,
        productDescription: null,
        productName: null,
        retailPrice: 0,
        revenueAcc: null,
        discountAcc: null,
        sectorId: null,
        sku: null,
        status: null,
        supplierId: null,
        unitId: null,
        vat: 0,
        warehouseId: null,
        warehouseAcc: null,
    };
    brands = companies;
    statusList = status;
    img: any;
    avt?: any = '../../../../../../assets/images/female.png';
    fields: FormlyFieldConfig[] = [
        {
            key: 'id',
        },
        {
            key: 'status',
            type: 'product-select',
            templateOptions: {
                label: 'Trạng thái',
                placeholder: 'Trạng thái',
                required: true,
                options: status,
            },
        },
        {
            key: 'stt',
            type: 'product-input',
            defaultValue: null,
            templateOptions: {
                type: 'number',
                label: 'Số thứ tự',
                placeholder: 'Số thứ tự',
            },
        },
        {
            key: 'brandId',
            type: 'product-select',
            defaultValue: null,

            templateOptions: {
                label: 'Nhãn hiệu',
                options: this.productDialogService.getAllBrands(),
            },
        },
        {
            key: 'sku',
            type: 'product-input',
            templateOptions: {
                label: 'Mã sản phẩm',
                required: true,
                placeholder: 'Nhập mã sản phẩm',
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
        },
        {
            key: 'majorId',
            defaultValue: null,
            type: 'product-select',
            templateOptions: {
                label: 'Ngành hàng',
                options: this.productDialogService.getAllMajors(),
            },
        },
        {
            key: 'supplierId',
            type: 'product-select',
            defaultValue: null,
            templateOptions: {
                label: 'Nhà cung cấp',
                required: true,
                options: this.productDialogService.getAllSuppliers(),
            },
        },
        {
            key: 'wholeSaleUnitId',
            type: 'product-select',
            defaultValue: null,
            templateOptions: {
                label: 'ĐVT chẵn',
                options: this.productDialogService.getAllUnits(),
            },
        },
        {
            key: 'retailUnitId',
            type: 'product-select',
            defaultValue: null,
            templateOptions: {
                label: 'ĐVT lẻ',
                options: this.productDialogService.getAllUnits(),
                required: true,
            },
        },
        {
            key: 'conversionNumber',
            type: 'product-input',
            templateOptions: {
                label: 'Hệ số quy đổi',
                placeholder: 'Nhập hệ số',
            },
        },
        {
            key: 'inventoryWarning',
            type: 'product-input',
            templateOptions: {
                label: 'Cảnh báo tồn kho',
                placeholder: 'Nhập số ',
            },
        },
        {
            key: 'importPrice',
            type: 'product-input',
            templateOptions: {
                label: 'Giá nhập',
                placeholder: 'Nhập giá',
            },
        },
        {
            key: 'importRetailPrice',
            type: 'product-input',

            templateOptions: {
                label: 'Giá nhập lẻ',
                placeholder: 'Nhập giá',
            },
        },
        {
            key: 'price',
            type: 'product-input',
            templateOptions: {
                label: 'Giá',
                placeholder: 'Nhập giá',
            },
        },
        {
            key: 'retailPrice',
            type: 'product-input',
            templateOptions: {
                label: 'Giá bán lẻ',
                placeholder: 'Nhập giá',
            },
        },
        {
            key: 'vat',
            type: 'product-select',
            defaultValue: null,

            templateOptions: {
                label: 'Thuế VAT',
                options: [
                    { value: 5, label: '5%' },
                    { value: 10, label: '10%' },
                ],
            },
        },
        {
            key: 'image',
            type: 'product-input',
            templateOptions: {
                label: 'Hình ảnh',
                disabled: true,
                placeholder: 'Nhập link hình ảnh',
            },
        },
        {
            key: 'productDescription',
            type: 'product-textarea',
            templateOptions: {
                type: 'textarea',
                label: 'Mô tả',
                placeholder: 'Nhập mô tả',
            },
        },
        {
            key: 'discountAcc',
            type: 'product-input',
            templateOptions: {
                label: 'Tài khoản chiết khấu',
                placeholder: 'Nhập tài khoản',
            },
        },
        {
            key: 'revenueAcc',
            type: 'product-input',
            templateOptions: {
                label: 'Tài khoản doanh thu',
                placeholder: 'Nhập tài khoản',
            },
        },
        {
            key: 'warehouseId',
            type: 'product-select',
            templateOptions: {
                label: 'Kho',
                options: this.productDialogService.getAllWarehouses(),
            },
        },
        {
            key: 'warehouseAcc',
            type: 'product-input',
            templateOptions: {
                label: 'Tài khoản kho',
                placeholder: 'Nhập tài khoản kho',
            },
        },
        {
            key: 'priceAcc',
            type: 'product-input',
            templateOptions: {
                label: 'Tài khoản giá vốn',
                placeholder: 'Nhập tài khoản',
            },
        },
    ];

    onSubmit(product: Product) {
        console.log(product);
        if (!this.form.invalid) {
            if (!product.id) {
                delete product.id;
                console.log(product);
                // this.productApiService.postProduct(product).subscribe({
                //     next: (res) => {
                //         this.dialogRef.closeAll();
                //         this.productService.getAllProducts();
                //     },
                //     error: (err) => {
                //         console.log(err);
                //     },
                // });
            } else {
                this.productApiService.updateProduct(product).subscribe({
                    next: (res) => {
                        this.dialogRef.closeAll();
                        this.productService.getInititalProducts(1);
                    },
                    error: (err) => {
                        console.log(err);
                    },
                });
            }
        }
    }
    constructor(
        private productDialogService: ProductDialogService,
        private dialogRef: MatDialog,
        private productApiService: ProductApiService,
        private productService: ProductService,
    ) {}

    ngOnInit(): void {
        this.productDialogService.changeHeader('');
        setTimeout(() => {
            if (this.productModel) {
                console.log(this.productModel);
                this.form.patchValue(this.productModel || {});
                this.productDialogService.changeHeader(this.productModel.sku || '');
                this.form.disable();
            }
        }, 0);
        this.subscription = this.productDialogService.submitForm$.subscribe(() => {
            this.submitButton.nativeElement.click();
        });
        this.subscription2 = this.productDialogService.toggleEdit$.subscribe((value: boolean) => {
            if (value) {
                this.form.enable();
            }
        });
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.subscription2.unsubscribe();
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
    manualSubmit() {}
}
