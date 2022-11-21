import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Subscription } from 'rxjs';
import { Channel } from 'src/app/core/model/Channel';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ChannelService } from '../../services/channel.service';

@Component({
  selector: 'app-detail-channel',
  templateUrl: './detail-channel.component.html',
  styleUrls: ['./detail-channel.component.scss']
})
export class DetailChannelComponent implements OnInit {

  @ViewChild('myForm') myForm: NgForm;
  @ViewChild('submitButton') submitButton: ElementRef;
  @Input() channelModel: Channel | null;
  @Input() status: string;
  @Input() dialogMode: 'create' | 'edit' | 'view' = 'create';
  form = new FormGroup({});
  subscription = new Subscription();
  subscription2 = new Subscription();

  model = {
    id: null,
    channelName: null,
    channelCode: null,
    deptLimit: null,
    status: null,
  };

  fields: FormlyFieldConfig[] = [
    {
        key: 'id',
    },
    {
        key: 'channelName',
        type: 'channel-input',
        templateOptions: {
            label: 'Tên kênh',
            placeholder: 'Nhập tên kênh',
            required: true,
        },
    },
    {
        key: 'channelCode',
        type: 'channel-input',
        defaultValue: null,
        templateOptions: {
            label: 'Mã kênh',
            placeholder: 'Nhập code kênh',
            required: true,
        },
    },
    {
        key: 'deptLimit',
        type: 'channel-select',
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
        type: 'channel-select',
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

  onSubmit(channel: Channel) {
    // console.log(brand);
    if (!this.form.invalid) {
        if (!channel.id) {
            delete channel.id;
            this.channelService.addChannel(channel).subscribe({
                next: (res) => {
                    this.snackbar.openSnackbar('Thêm thành công', 2000, 'Đóng', 'center', 'top', true);
                    this.dialogRef.close({event: true});
                },
                error: (err) => {
                    console.log(err);
                },
            });
        } else {
            this.channelService.updateChannel(channel).subscribe({
                next: (res) => {
                    this.snackbar.openSnackbar('Sửa kênh thành công', 2000, 'Đóng', 'center', 'bottom', true);
                    this.dialogRef.close({event: true});
                },
                error: (err) => {
                    this.snackbar.openSnackbar('Sửa kênh thất bại', 2000, 'Đóng', 'center', 'bottom', true);
                    console.log(err);
                },
            });
        }
    }
  }

  constructor(
    public dialogRef: MatDialogRef<DetailChannelComponent>,
    private snackbar: SnackbarService,
    private channelService: ChannelService,
  ) { }

  ngOnInit(): void {
    this.channelService.changeHeader('');
    setTimeout(() => {
        if (this.channelModel) {
            // console.log(this.channelModel);
            this.form.patchValue(this.channelModel || {});
            this.channelService.changeHeader(this.channelModel.channelName || '');
            this.form.disable();
        }
    }, 0);
    this.subscription = this.channelService.submitForm$.subscribe(() => {
        this.submitButton.nativeElement.click();
    });
    this.subscription2 = this.channelService.toggleEdit$.subscribe((value: boolean) => {
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
