import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Subscription } from 'rxjs';
import { Area } from 'src/app/core/model/Area';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AreaService } from '../../services/area.service';

@Component({
  selector: 'app-detail-area',
  templateUrl: './detail-area.component.html',
  styleUrls: ['./detail-area.component.scss']
})
export class DetailAreaComponent implements OnInit {

  @ViewChild('myForm') myForm: NgForm;
  @ViewChild('submitButton') submitButton: ElementRef;
  @Input() areaModel: Area | null;
  @Input() status: string;
  @Input() dialogMode: 'create' | 'edit' | 'view' = 'create';
  form = new FormGroup({});
  subscription = new Subscription();
  subscription2 = new Subscription();

  model = {
    id: null,
    areaName: null,
    areaCode: null,
    deptLimit: null,
    status: null,
  };

  fields: FormlyFieldConfig[] = [
    {
        key: 'id',
    },
    {
        key: 'areaName',
        type: 'area-input',
        templateOptions: {
            label: 'Tên khu vực',
            placeholder: 'Nhập tên khu vực',
            required: true,
        },
    },
    {
        key: 'areaCode',
        type: 'area-input',
        defaultValue: null,
        templateOptions: {
            label: 'Mã khu vực',
            placeholder: 'Nhập code khu vực',
            required: true,
        },
    },
    {
        key: 'fatherArea',
        type: 'area-input',
        defaultValue: null,
        templateOptions: {
            label: 'Mã khu vực cha',
            placeholder: 'Nhập tên khu vực cha',
            required: true,
        },
    },
    {
        key: 'deptLimit',
        type: 'area-select',
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
        type: 'area-select',
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

  onSubmit(area: Area) {
      if (!this.form.invalid) {
          if (!area.id) {
            delete area.id;
            this.areaService.addArea(area).subscribe({
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
            this.areaService.updateArea(area).subscribe({
                next: (res) => {
                    this.snackbar.openSnackbar('Sửa khu vực thành công', 2000, 'Đóng', 'center', 'bottom', true);
                    this.dialogRef.close({event: true});
                },
                error: (err) => {
                    this.snackbar.openSnackbar('Sửa khu vực thất bại', 2000, 'Đóng', 'center', 'bottom', true);
                    console.log(err);
                },
            });
        }
    }
  }

  constructor(
    public dialogRef: MatDialogRef<DetailAreaComponent>,
    private snackbar: SnackbarService,
    private areaService: AreaService,
  ) { }

  ngOnInit(): void {
    this.areaService.changeHeader('');
    setTimeout(() => {
        if (this.areaModel) {
            // console.log(this.areaModel);
            this.form.patchValue(this.areaModel || {});
            this.areaService.changeHeader(this.areaModel.areaName || '');
            this.form.disable();
        }
    }, 0);
    this.subscription = this.areaService.submitForm$.subscribe(() => {
        this.submitButton.nativeElement.click();
    });
    this.subscription2 = this.areaService.toggleEdit$.subscribe((value: boolean) => {
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
