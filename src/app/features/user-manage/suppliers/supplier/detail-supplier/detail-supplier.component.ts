import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Subscription } from 'rxjs';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Supplier } from 'src/app/features/product/models/product';
import { SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-detail-supplier',
  templateUrl: './detail-supplier.component.html',
  styleUrls: ['./detail-supplier.component.scss']
})
export class DetailSupplierComponent implements OnInit {

  @ViewChild('myForm') myForm: NgForm;
  @ViewChild('submitButton') submitButton: ElementRef;
  @Input() supplierModel: Supplier | null;
  @Input() status: string;
  @Input() dialogMode: 'create' | 'edit' | 'view' = 'create';
  form = new FormGroup({});
  subscription = new Subscription();
  subscription2 = new Subscription();

  model = {
    id: null,
    supplierName: null,
    supplierCode: null,
    address: null,
    taxCode: null,
    phone: null,
    province: null,
    debtLimit: null,
    numberOfDaysOwed: null,
    status: null,
  };

  fields: FormlyFieldConfig[] = [
    {
        key: 'id',
    },
    {
        key: 'supplierCode',
        type: 'supplier-input',
        defaultValue: null,
        templateOptions: {
            label: 'Mã nhà cung cấp',
            placeholder: 'Nhập code nhà cung cấp',
            required:   false,
        },
    },
    {
        key: 'supplierName',
        type: 'supplier-input',
        templateOptions: {
            label: 'Tên nhà cung cấp',
            placeholder: 'Nhập tên nhà cung cấp',
            required: false,
        },
    },
    {
        key: 'address',
        type: 'supplier-input',
        defaultValue: null,
        templateOptions: {
            label: 'Địa chỉ',
            placeholder: 'Nhập địa chỉ',
            required: false,
        },
    },
    {
        key: 'taxCode',
        type: 'supplier-input',
        defaultValue: null,
        templateOptions: {
            label: 'Mã số thuế',
            placeholder: 'Nhập mã số thuế',
            required: false,
        },
    },
    {
        key: 'phone',
        type: 'supplier-input',
        defaultValue: null,
        templateOptions: {
            label: 'Số điện thoại',
            placeholder: 'Nhập số điện thoại',
            required: false,
        },
    },
    {
        key: 'province',
        type: 'supplier-input',
        defaultValue: null,
        templateOptions: {
            label: 'Tỉnh/TP',
            placeholder: 'Nhập Tỉnh/TP',
            required: false,
        },
    },
    {
        key: 'debtLimit',
        type: 'supplier-input',
        defaultValue: null,
        templateOptions: {
            label: 'Hạn mức công nợ',
            placeholder: 'Nhập hạn mức công nợ',
            required: true,
        },
    },
    {
        key: 'numberOfDaysOwed',
        type: 'supplier-input',
        defaultValue: null,
        templateOptions: {
            label: 'Số ngày được nợ',
            placeholder: 'Nhập số ngày được nợ',
            required: false,
        },
    },
    {
        key: 'status',
        type: 'supplier-select',
        defaultValue: null,
        templateOptions: {
            label: 'Trạng thái',
            required: true,
            options: [
                { value: true, label: 'Mở' },
                { value: false, label: 'Khóa' },
            ],
        },
    },
  ];

  onSubmit(supplier: Supplier) {
      if (!this.form.invalid) {
          if (!supplier.id) {
            delete supplier.id;
            this.supplierService.addSupplier(supplier).subscribe({
                next: (res) => {
                    this.snackbar.openSnackbar('Thêm thành công', 2000, 'Đóng', 'center', 'top', true);
                    this.dialogRef.close({event: true});
                },
                error: (err) => {
                    console.log(err);
                },
            });
        } else {
            // console.log(supplier);
            this.supplierService.updateSupplier(supplier).subscribe({
                next: (res) => {
                    this.snackbar.openSnackbar('Sửa nhãn hiệu thành công', 2000, 'Đóng', 'center', 'bottom', true);
                    this.dialogRef.close({event: true});
                },
                error: (err) => {
                    this.snackbar.openSnackbar('Sửa nhãn hiệu thất bại', 2000, 'Đóng', 'center', 'bottom', true);
                    console.log(err);
                },
            });
        }
    }
  }

  constructor(
    public dialogRef: MatDialogRef<DetailSupplierComponent>,
    private snackbar: SnackbarService,
    private supplierService: SupplierService,
  ) { }

  ngOnInit(): void {
    this.supplierService.changeHeader('');
    setTimeout(() => {
        if (this.supplierModel) {
            // console.log(this.brandModel);
            this.form.patchValue(this.supplierModel || {});
            this.supplierService.changeHeader(this.supplierModel.supplierName || '');
            this.form.disable();
        }
    }, 0);
    this.subscription = this.supplierService.submitForm$.subscribe(() => {
        this.submitButton.nativeElement.click();
    });
    this.subscription2 = this.supplierService.toggleEdit$.subscribe((value: boolean) => {
        if (value) {
            this.form.enable();
        }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }

  close() {
    this.dialogRef.close();
  }

}
