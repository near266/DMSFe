import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Subscription } from 'rxjs';
import { CustomerType } from 'src/app/core/model/CustomerType';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { CustomerTypeService } from '../../services/customer-type.service';

@Component({
  selector: 'app-detail-customer-type',
  templateUrl: './detail-customer-type.component.html',
  styleUrls: ['./detail-customer-type.component.scss']
})
export class DetailCustomerTypeComponent implements OnInit {

  @ViewChild('myForm') myForm: NgForm;
  @ViewChild('submitButton') submitButton: ElementRef;
  @Input() customertypeModel: CustomerType | null;
  @Input() status: string;
  @Input() dialogMode: 'create' | 'edit' | 'view' = 'create';
  form = new FormGroup({});
  subscription = new Subscription();
  subscription2 = new Subscription();

  model = {
    id: null,
    customerTypeName: null,
    customerTypeCode: null,
    deptLimit: null,
    status: null,
  };

  fields: FormlyFieldConfig[] = [
    {
        key: 'id',
    },
    {
        key: 'customerTypeCode',
        type: 'customerType-input',
        defaultValue: null,
        templateOptions: {
            label: 'Mã loại khách hàng',
            placeholder: 'Nhập code loại khách hàng',
            required: true,
        },
    },
    {
        key: 'customerTypeName',
        type: 'customerType-input',
        templateOptions: {
            label: 'Tên loại khách hàng',
            placeholder: 'Nhập tên loại khách hàng',
            required: true,
        },
    },
    {
        key: 'miniumCheckinTime',
        type: 'customerType-input',
        defaultValue: null,
        templateOptions: {
            label: 'Thời gian checkin tối thiểu',
            placeholder: '1 ==> 60 Phút',
            required: false,
        },
    },
    {
        key: 'compulsoryPhotography',
        type: 'customerType-input',
        defaultValue: null,
        templateOptions: {
            label: 'Bắt buộc chụp ảnh',
            placeholder: 'Mặc định theo tổ chức',
            required: false,
        },
    },
    {
        key: 'mandatoryInventoryRecord',
        type: 'customerType-input',
        defaultValue: null,
        templateOptions: {
            label: 'Bắt buộc ghi tồn kho',
            placeholder: 'Mặc định theo tổ chức',
            required: false,
        },
    },
    {
        key: 'deptLimit',
        type: 'customerType-select',
        defaultValue: null,
        templateOptions: {
            label: 'Giới hạn phòng ban',
            required: true,
            options: [
                { value: true, label: 'Giới hạn' },
                { value: false, label: 'Không giới hạn' },
            ],
        },
    },
    {
        key: 'status',
        type: 'customerType-select',
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

  onSubmit(customerType: CustomerType) {
      if (!this.form.invalid) {
          if (!customerType.id) {
            delete customerType.id;
            this.customerTypeService.addCustomerType(customerType).subscribe({
                next: (res) => {
                    this.snackbar.openSnackbar('Thêm thành công', 2000, 'Đóng', 'center', 'top', true);
                    this.dialogRef.close({event: true});
                },
                error: (err) => {
                    console.log(err);
                },
            });
        } else {
            console.log(customerType);
            this.customerTypeService.updateCustomerType(customerType).subscribe({
                next: (res) => {
                    this.snackbar.openSnackbar('Sửa loại khách hàng thành công', 2000, 'Đóng', 'center', 'bottom', true);
                    this.dialogRef.close({event: true});
                },
                error: (err) => {
                    this.snackbar.openSnackbar('Sửa loại khách hàng thất bại', 2000, 'Đóng', 'center', 'bottom', true);
                    console.log(err);
                },
            });
        }
    }
  }

  constructor(
    public dialogRef: MatDialogRef<DetailCustomerTypeComponent>,
    private snackbar: SnackbarService,
    private customerTypeService: CustomerTypeService,
  ) { }

  ngOnInit(): void {
    this.customerTypeService.changeHeader('');
    setTimeout(() => {
        if (this.customertypeModel) {
            // console.log(this.customertypeModel);
            this.form.patchValue(this.customertypeModel || {});
            this.customerTypeService.changeHeader(this.customertypeModel.customerTypeName || '');
            this.form.disable();
        }
    }, 0);
    this.subscription = this.customerTypeService.submitForm$.subscribe(() => {
        this.submitButton.nativeElement.click();
    });
    this.subscription2 = this.customerTypeService.toggleEdit$.subscribe((value: boolean) => {
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
