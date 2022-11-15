import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Subscription } from 'rxjs';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Major } from 'src/app/features/product/models/product';
import { MajorService } from '../../services/major.service';

@Component({
  selector: 'app-detail-major',
  templateUrl: './detail-major.component.html',
  styleUrls: ['./detail-major.component.scss']
})
export class DetailMajorComponent implements OnInit {

  @ViewChild('myForm') myForm: NgForm;
  @ViewChild('submitButton') submitButton: ElementRef;
  @Input() majorModel: Major | null;
  @Input() status: string;
  @Input() dialogMode: 'create' | 'edit' | 'view' = 'create';
  form = new FormGroup({});
  subscription = new Subscription();
  subscription2 = new Subscription();

  model = {
    id: null,
    commodityName: null,
    commodityCode: 0,
    status: null,
  };

  fields: FormlyFieldConfig[] = [
    {
        key: 'id',
    },
    {
        key: 'commodityName',
        type: 'major-input',
        templateOptions: {
            label: 'Tên ngành hàng',
            placeholder: 'Nhập tên ngành hàng',
            required: true,
        },
    },
    {
        key: 'commodityCode',
        type: 'major-input',
        defaultValue: null,
        templateOptions: {
            label: 'Mã ngành hàng',
            placeholder: 'Nhập code ngành hàng',
            required: true,
        },
    },
    {
        key: 'debtLimit',
        type: 'major-select',
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
        type: 'major-select',
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

  onSubmit(major: Major) {
    // console.log(brand);
    if (!this.form.invalid) {
        if (!major.id) {
            delete major.id;
            this.majorService.addMajor(major).subscribe({
                next: (res) => {
                    this.snackbar.openSnackbar('Thêm thành công', 2000, 'Đóng', 'center', 'top', true);
                    this.dialogRef.close({event: true});
                },
                error: (err) => {
                    console.log(err);
                },
            });
        } else {
            this.majorService.updateMajor(major).subscribe({
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
    public dialogRef: MatDialogRef<DetailMajorComponent>,
    private snackbar: SnackbarService,
    private majorService: MajorService,
  ) { }

  ngOnInit(): void {
    this.majorService.changeHeader('');
    setTimeout(() => {
        if (this.majorModel) {
            console.log(this.majorModel);
            this.form.patchValue(this.majorModel || {});
            this.majorService.changeHeader(this.majorModel.commodityName || '');
            this.form.disable();
        }
    }, 0);
    this.subscription = this.majorService.submitForm$.subscribe(() => {
        this.submitButton.nativeElement.click();
    });
    this.subscription2 = this.majorService.toggleEdit$.subscribe((value: boolean) => {
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
