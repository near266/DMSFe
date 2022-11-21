import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Subscription } from 'rxjs';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Brand } from 'src/app/features/product/models/product';
import { BranchService } from '../../services/branch.service';

@Component({
  selector: 'app-detail-brand',
  templateUrl: './detail-brand.component.html',
  styleUrls: ['./detail-brand.component.scss']
})
export class DetailBrandComponent implements OnInit {

  @ViewChild('myForm') myForm: NgForm;
  @ViewChild('submitButton') submitButton: ElementRef;
  @Input() brandModel: Brand | null;
  @Input() status: string;
  @Input() dialogMode: 'create' | 'edit' | 'view' = 'create';
  form = new FormGroup({});
  subscription = new Subscription();
  subscription2 = new Subscription();

  model = {
    id: null,
    brandName: null,
    brandCode: null,
    debtLimit: null,
    status: null,
  };

  fields: FormlyFieldConfig[] = [
    {
        key: 'id',
    },
    {
        key: 'brandName',
        type: 'brand-input',
        templateOptions: {
            label: 'Tên nhãn hiệu',
            placeholder: 'Nhập tên nhãn hiệu',
            required: true,
        },
    },
    {
        key: 'brandCode',
        type: 'brand-input',
        defaultValue: null,
        templateOptions: {
            label: 'Mã nhãn hiệu',
            placeholder: 'Nhập code nhãn hiệu',
            required: true,
        },
    },
    {
        key: 'debtLimit',
        type: 'brand-select',
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
        type: 'brand-select',
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

  onSubmit(brand: Brand) {
      if (!this.form.invalid) {
          if (!brand.id) {
            delete brand.id;
            this.branchService.addBrand(brand).subscribe({
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
            this.branchService.updateBrand(brand).subscribe({
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
    public dialogRef: MatDialogRef<DetailBrandComponent>,
    private snackbar: SnackbarService,
    private branchService: BranchService,
  ) { }

  ngOnInit(): void {
    this.branchService.changeHeader('');
    setTimeout(() => {
        if (this.brandModel) {
            // console.log(this.brandModel);
            this.form.patchValue(this.brandModel || {});
            this.branchService.changeHeader(this.brandModel.brandName || '');
            this.form.disable();
        }
    }, 0);
    this.subscription = this.branchService.submitForm$.subscribe(() => {
        this.submitButton.nativeElement.click();
    });
    this.subscription2 = this.branchService.toggleEdit$.subscribe((value: boolean) => {
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
