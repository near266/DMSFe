import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/core/services/data.service';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ConfirmDialogService } from 'src/app/core/shared/services/confirm-dialog.service';
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
    private dataService: DataService,
    public dia: MatDialogRef<any>,
    private employeeService: EmployeeService,
    private snackbar: SnackbarService,
    private confirmService: ConfirmDialogService
  ) { }

  title = 'Thông tin chung'

  ngOnInit(): void {
  }

  tabList = [
    { title: 'Thông tin chung', leftIcon: 'fa-regular fa-file-lines' },
    { title: 'Cấu hình nhân viên', leftIcon: 'fa-solid fa-gear' },
    { title: 'App nhân viên', leftIcon: 'fa-solid fa-gear' },
    // { title: 'Menu hiển thị', leftIcon: 'fa-solid fa-list' },
    // { title: 'Chấm thi phòng nhóm', leftIcon: 'fa-solid fa-location-dot' },
  ]

  ResetPw() {
    this.dialog.open(ResetPasswordComponent, {
      data: {login: this.dataDialog.login},
    })
  }

  DeleteUser() {
    this.confirmService.openDialog({message: 'Bạn có chắc chắn muốn xóa nhân viên này?',confirm: 'Xác nhận',cancel: 'Hủy'}).subscribe(data => {
      if(data) {
        this.employeeService.DeleteEmployee(this.dataDialog.id).subscribe( response => {
          if(response) {
            this.snackbar.openSnackbar('Xóa nhân viên thành công', 2000, 'Đóng', 'center', 'bottom', true);
            this.dataService.changeEmployee('success');
          } else {
            this.snackbar.openSnackbar('Xóa nhân viên thất bại', 2000, 'Đóng', 'center', 'bottom', false);
          }
        }, (error) => {
          this.snackbar.openSnackbar('Xóa nhân viên thất bại', 2000, 'Đóng', 'center', 'bottom', false);
        });
      }
    });
  }
  Update() {
    this.dataService.changeEmployee('update')
  }

  Deleted(e: any) {
    if (e == 'delete') {
      this.dia.close()
    }
  }
}
