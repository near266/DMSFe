import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ResetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbar: SnackbarService,
    private employeeService: EmployeeService
    ) { }

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      login: new FormControl(this.data.login),
      newPassword: new FormControl(''),
      rePassword: new FormControl('')
    });
  }

  submit() {
    if(this.resetForm.controls['newPassword'].value == '' || this.resetForm.controls['rePassword'].value == '') {
      this.snackbar.openSnackbar('Vui lòng điền đầy đủ để đặt lại mật khẩu', 2000, 'Đóng', 'center', 'bottom', false);
      return;
    }
    if(this.resetForm.controls['newPassword'].value != this.resetForm.controls['rePassword'].value) {
      this.snackbar.openSnackbar('Nhập lại mật khẩu không đúng', 2000, 'Đóng', 'center', 'bottom', false);
      return;
    }
    const body = {
      login: this.resetForm.controls['login'].value,
      newPassword: this.resetForm.controls['newPassword'].value,
      rePassword: this.resetForm.controls['rePassword'].value
    }
    this.employeeService.ResetPasswordEmployee(body).subscribe(response => {
      this.snackbar.openSnackbar('Đặt lại mật khẩu thành công', 2000, 'Đóng', 'center', 'bottom', true);
      this.dialogRef.close();
    }, (error) => {
      this.snackbar.openSnackbar('Đặt lại mật khẩu thất bại', 2000, 'Đóng', 'center', 'bottom', false);
    });
  }

}
