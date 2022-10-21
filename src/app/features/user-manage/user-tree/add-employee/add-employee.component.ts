import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Response } from 'src/app/core/model/Response';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

export interface Page {
  items: any[],
  checked: any[]
}

export interface Body {
  employeeId: string[],
  unitTreeGroupId: string
}

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit, AfterViewInit {

  page = 1;
  pageSize = 9;
  totalPage = 0;
  response: Response<any> = {
    data: [],
    totalCount: 0
  };

  userList: Response<any> = {
    data: [],
    totalCount: 0
  };

  pages: Page[] = [];

  pageList: number[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public id: string,
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private snackbar: SnackbarService
    ) { }

  ngAfterViewInit(): void {
    this.init(this.page, this.pageSize);
  }

  init(page: number, pageSize: number) {
    this.employeeService.GetAllEmployeeByTitle('Nhân viên', page, pageSize).subscribe(data => {
      if(data) {
        this.response = data;
        this.employeeService.SearchEmployeeInGroup(this.id, page, 1000).subscribe(res => {
          this.userList = res;
          this.response.data.forEach(element => {
            element.checked = false;
            this.userList.data.forEach( e => {
              if(element.id == e.employee.id) {
                element.checked = true;
                element.disabled = true;
              }
            })
          });
        });
        this.totalPage = Number.parseInt((this.response.totalCount/this.pageSize).toString());
        if(this.response.totalCount % this.pageSize > 0) this.totalPage++;
        this.pages[page] = {
          items: this.response.data,
          checked: []
        };
        this.pageList = [];
        for(let i = 1; i <= this.totalPage; i++) {
          this.pageList.push(i);
        }
      }
    });
  }

  paging(page: number, pageSize: number) {
    this.page = page;
    if (!this.pages[page]) {
      this.employeeService.GetAllEmployeeByTitle('Nhân viên', page, pageSize).subscribe(data => {
        if(data) {
          this.response = data;
          this.response.data.forEach(element => {
            element.checked = false;
            this.userList.data.forEach( e => {
              if(element.id == e.employee.id) {
                element.checked = true;
                element.disabled = true;
              }
            })
          });
          this.totalPage = Number.parseInt((this.response.totalCount/this.pageSize).toString());
          if(this.response.totalCount % this.pageSize > 0) this.totalPage++;
          this.pages[page] = {
            items: this.response.data,
            checked: []
          };
          this.pageList = [];
          for(let i = 1; i <= this.totalPage; i++) {
            this.pageList.push(i);
          }
        }
      });
    } else {
      this.response.data = this.pages[page].items;
    }
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

  selected_items(page: number, id: string) {
    const i = this.pages[page].checked.indexOf(id);
    if(i == -1) {
      this.pages[page].checked.push(id);
    } else {
      this.pages[page].checked.splice(i, 1);
    }
  }

  save() {
    let body: Body = {
      employeeId: [],
      unitTreeGroupId: this.id
    }
    for(let i = 1; i <= this.pages.length; i++) {
      if(this.pages[i]) {
        this.pages[i].checked.forEach(element => {
          body.employeeId.push(element);
        });
      }
    }
    this.employeeService.AddEmployeeUnitTree(body).subscribe( data => {
      this.snackbar.openSnackbar('Thêm quản lý thành công', 2000, 'Đóng', 'center', 'bottom', true);
      this.dialogRef.close({event: true});
    }, (error) => {
      this.snackbar.openSnackbar('Thêm quản lý thất bại, vui lòng kiểm tra lại', 2000, 'Đóng', 'center', 'bottom', true);
    });

  }

}
