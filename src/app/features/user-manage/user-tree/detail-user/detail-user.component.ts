import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/core/services/data.service';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.scss']
})
export class DetailUserComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public dataDialog: any,
    private dialog: MatDialog,
    private dataService: DataService
  ) { }

  title = 'Thông tin chung'

  ngOnInit(): void {
    console.log(this.dataDialog.employeeId);
    
  }

  tabList = [
    { title: 'Thông tin chung', leftIcon: 'fa-regular fa-file-lines' },
    { title: 'Cấu hình nhân viên', leftIcon: 'fa-solid fa-gear' },
    { title: 'App nhân viên', leftIcon: 'fa-solid fa-gear' },
    { title: 'Menu hiển thị', leftIcon: 'fa-solid fa-list' },
    // { title: 'Chấm thi phòng nhóm', leftIcon: 'fa-solid fa-location-dot' },
  ]

  ResetPw() {
    this.dialog.open(ResetPasswordComponent, {
      data: {},
    })
  }

  DeleteUser() {
    this.dialog.open(DeleteUserComponent, {
      data: {},
      maxWidth: '520px'
    })
  }
  Update(){
    this.dataService.changeEmployee('update')
  }
}
