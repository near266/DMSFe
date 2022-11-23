import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Subscription } from 'rxjs';
import { CustomerGroup } from 'src/app/core/model/CustomerGroup';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { CustomerGroupsService } from '../../services/customer-groups.service';

@Component({
  selector: 'app-detail-customer-group',
  templateUrl: './detail-customer-group.component.html',
  styleUrls: ['./detail-customer-group.component.scss']
})
export class DetailCustomerGroupComponent implements OnInit {

  @ViewChild('myForm') myForm: NgForm;
  @ViewChild('submitButton') submitButton: ElementRef;
  @Input() customergroupModel: CustomerGroup | null;
  @Input() status: string;
  @Input() dialogMode: 'create' | 'edit' | 'view' = 'create';
  form = new FormGroup({});
  subscription = new Subscription();
  subscription2 = new Subscription();

  model = {
    id: null,
    customerGroupName: null,
    customerGroupCode: null,
    deptLimit: null,
    status: null,
  };

  fields: FormlyFieldConfig[] = [
    {
        key: 'id',
    },
    {
        key: 'customerGroupName',
        type: 'customerGroup-input',
        templateOptions: {
            label: 'Tên nhóm khách hàng',
            placeholder: 'Nhập tên nhóm khách hàng',
            required: true,
        },
    },
    {
        key: 'customerGroupCode',
        type: 'customerGroup-input',
        defaultValue: null,
        templateOptions: {
            label: 'Mã nhóm khách hàng',
            placeholder: 'Nhập code nhóm khách hàng',
            required: true,
        },
    },
    {
        key: 'deptLimit',
        type: 'customerGroup-select',
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
        type: 'customerGroup-select',
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

  onSubmit(customerGroup: CustomerGroup) {
      if (!this.form.invalid) {
          if (!customerGroup.id) {
            delete customerGroup.id;
            this.customerGroupService.addCustomerGroup(customerGroup).subscribe({
                next: (res) => {
                    this.snackbar.openSnackbar('Thêm thành công', 2000, 'Đóng', 'center', 'top', true);
                    this.dialogRef.close({event: true});
                },
                error: (err) => {
                    console.log(err);
                },
            });
        } else {
            // console.log(brand);
            this.customerGroupService.updateCustomerGroup(customerGroup).subscribe({
                next: (res) => {
                    this.snackbar.openSnackbar('Sửa nhóm khách hàng thành công', 2000, 'Đóng', 'center', 'bottom', true);
                    this.dialogRef.close({event: true});
                },
                error: (err) => {
                    this.snackbar.openSnackbar('Sửa nhóm khách hàng thất bại', 2000, 'Đóng', 'center', 'bottom', true);
                    console.log(err);
                },
            });
        }
    }
  }

  constructor(
    public dialogRef: MatDialogRef<DetailCustomerGroupComponent>,
    private snackbar: SnackbarService,
    private customerGroupService: CustomerGroupsService,
  ) { }

  ngOnInit(): void {
    this.customerGroupService.changeHeader('');
    setTimeout(() => {
        if (this.customergroupModel) {
            // console.log(this.customergroupModel);
            this.form.patchValue(this.customergroupModel || {});
            this.customerGroupService.changeHeader(this.customergroupModel.customerGroupName || '');
            this.form.disable();
        }
    }, 0);
    this.subscription = this.customerGroupService.submitForm$.subscribe(() => {
        this.submitButton.nativeElement.click();
    });
    this.subscription2 = this.customerGroupService.toggleEdit$.subscribe((value: boolean) => {
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
