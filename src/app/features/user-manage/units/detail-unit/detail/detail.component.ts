import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Subscription } from 'rxjs';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Unit } from 'src/app/features/product/models/product';
import { UnitService } from '../../services/unit.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  @ViewChild('myForm') myForm: NgForm;
  @ViewChild('submitButton') submitButton: ElementRef;
  @Input() unitModel: Unit | null;
  @Input() status: string;
  @Input() dialogMode: 'create' | 'edit' | 'view' = 'create';
  form = new FormGroup({});
  subscription = new Subscription();
  subscription2 = new Subscription();

  model = {
    id: null,
    unitName: null,
    unitCode: null,
    status: null,
  };

  fields: FormlyFieldConfig[] = [
    {
        key: 'id',
    },
    {
        key: 'status',
        type: 'unit-select',
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
    {
        key: 'unitName',
        type: 'unit-input',
        templateOptions: {
            label: 'Tên đơn vị tính',
            placeholder: 'Nhập tên đơn vị tính',
            required: true,
        },
    },
    {
        key: 'unitCode',
        type: 'unit-input',
        defaultValue: null,
        templateOptions: {
            label: 'ĐVT lẻ',
            placeholder: 'Nhập code đơn vị tính',
            required: true,
        },
    },
  ];

  onSubmit(unit: Unit) {
    // console.log(unit);
    if (!this.form.invalid) {
        if (!unit.id) {
            delete unit.id;
            this.unitService.addUnit(unit).subscribe({
                next: (res) => {
                    this.snackbar.openSnackbar('Thêm thành công', 2000, 'Đóng', 'center', 'top', true);
                    this.dialogRef.close({event: true});
                },
                error: (err) => {
                    console.log(err);
                },
            });
        } else {
            this.unitService.updateUnit(unit).subscribe({
                next: (res) => {
                    this.snackbar.openSnackbar('Sửa đơn vị thành công', 2000, 'Đóng', 'center', 'bottom', true);
                    this.dialogRef.close({event: true});
                },
                error: (err) => {
                    this.snackbar.openSnackbar('Sửa đơn vị thất bại', 2000, 'Đóng', 'center', 'bottom', true);
                    console.log(err);
                },
            });
        }
    }
  }

  constructor(
      public dialogRef: MatDialogRef<DetailComponent>,
      private snackbar: SnackbarService,
      private unitService: UnitService,
  ) {}

  ngOnInit(): void {
    this.unitService.changeHeader('');
    setTimeout(() => {
        if (this.unitModel) {
            // console.log(this.unitModel);
            this.form.patchValue(this.unitModel || {});
            this.unitService.changeHeader(this.unitModel.unitName || '');
            this.form.disable();
        }
    }, 0);
    this.subscription = this.unitService.submitForm$.subscribe(() => {
        this.submitButton.nativeElement.click();
    });
    this.subscription2 = this.unitService.toggleEdit$.subscribe((value: boolean) => {
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
