import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-move-user',
  templateUrl: './move-user.component.html',
  styleUrls: ['./move-user.component.scss']
})
export class MoveUserComponent implements OnInit, AfterViewInit {

  listAllGroup: any[] = [];
  bufferGroup: any[] = [];
  showGroup = false;
  groupSelected = '';
  groupId: ''

  constructor(
    public dialogRef: MatDialogRef<MoveUserComponent>,
    @Inject(MAT_DIALOG_DATA) public user: any,
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private snackbar: SnackbarService
  ) { }

  ngAfterViewInit(): void {
    if(!this.user.position.includes('Nhân viên')) {
      this.employeeService.GetAllGroupByType(0).subscribe((data: any[]) => {
        if(data) {
          data.forEach(element => {
            this.listAllGroup.push(element);
            this.bufferGroup.push(element);
          });
        }
      });
    }
    this.employeeService.GetAllGroupByType(1).subscribe((data: any[]) => {
      if(data) {
        data.forEach(element => {
          this.listAllGroup.push(element);
          this.bufferGroup.push(element);
        });
      }
    });
  }

  ngOnInit(): void {
  }

  submit() {
    let body = {
      unitTreeGroupId: this.groupId,
      employeeId: [this.user.id]
    }
    this.employeeService.AddEmployeeUnitTree(body).subscribe( data => {
      if(data) {
        this.employeeService.DeleteEmployeeUnitTree(this.user.id, this.user.parentId).subscribe(res => {
          this.snackbar.openSnackbar('Di chuyển người dùng thành công', 2000, 'Đóng', 'center', 'bottom', true);
          this.dialogRef.close({event: this.groupId});
        }, (error) => {
          this.employeeService.DeleteEmployeeUnitTree(this.user.id, this.groupId).subscribe(res => {
            this.snackbar.openSnackbar('Di chuyển người dùng thất bại', 2000, 'Đóng', 'center', 'bottom', false);
          });
        });
      }
    }, (error) => {
      this.snackbar.openSnackbar('Di chuyển người dùng thất bại', 2000, 'Đóng', 'center', 'bottom', false);
    });
  }

  close() {
    this.dialogRef.close();
  }

  selectedGroup(item: any) {
    this.showGroup = false;
    this.groupSelected = item.name;
    this.groupId = item.id;
  }

  searchGroup(){
    if(this.groupSelected != '') {
      this.bufferGroup = [];
      this.listAllGroup.forEach(element => {
        element.name += '';
        if(this.removeVietnameseTones(element.name.toLowerCase()).includes(this.removeVietnameseTones(this.groupSelected.toLowerCase()))) {
          this.bufferGroup.push(element);
        }
      });
    } else {
      this.bufferGroup = this.listAllGroup;
    }
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
