import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ChannelService } from '../services/channel.service';

@Component({
  selector: 'app-add-channel',
  templateUrl: './add-channel.component.html',
  styleUrls: ['./add-channel.component.scss']
})
export class AddChannelComponent implements OnInit {

  loading = true;
  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddChannelComponent>,
    private snackbar: SnackbarService,
    private fb: FormBuilder,
    private channelService: ChannelService,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      channelCode: new FormControl(''),
      channelName: new FormControl(''),
      status: new FormControl(''),
      deptLimit: new FormControl(''),
    })
  }

  add(){
    let body = {
      channelName: this.form.controls['channelName'].value !== '' ? this.form.controls['channelName'].value: null,
      channelCode: this.form.controls['channelCode'].value !== '' ? this.form.controls['channelCode'].value: null,
      status: this.form.controls['status'].value !== '' ? this.form.controls['status'].value: false,
      deptLimit: this.form.controls['deptLimit'].value !== '' ? this.form.controls['deptLimit'].value: false,
    }

    if(body.status == 'true') {
      body.status = true;
    } else if(body.status == 'false') {
      body.status = false;
    }
    if(body.deptLimit == 'true') {
      body.deptLimit = true;
    } else if(body.deptLimit == 'false') {
      body.deptLimit = false;
    }
    this.channelService.addChannel(body).subscribe( data => {
      this.snackbar.openSnackbar('Thêm nhãn hiệu thành công', 2000, 'Đóng', 'center', 'bottom', true);
      this.dialogRef.close({event: true});
    }, (error) => {
      this.snackbar.openSnackbar('Thêm nhãn hiệu thất bại', 2000, 'Đóng', 'center', 'bottom', true);
    });

  }

  close() {
    this.dialogRef.close();
  }

  removeVietnameseTones(str: any) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
    str = str.replace(/\u02C6|\u0306|\u031B/g, '');
    str = str.replace(/ + /g, ' ');
    str = str.trim();
    str = str.replace(
      /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
      ' '
    );
    return str;
  }

}
