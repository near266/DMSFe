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

@Component({
  selector: 'app-add-manager',
  templateUrl: './add-manager.component.html',
  styleUrls: ['./add-manager.component.scss']
})
export class AddManagerComponent implements OnInit, AfterViewInit {

  page = 1;
  pageSize = 9;
  totalPage = 0;
  response: Response<any> = {
    data: [],
    totalCount: 0
  };

  pages: Page[] = [];

  pageList: number[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddManagerComponent>,
    @Inject(MAT_DIALOG_DATA) public id: string,
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private snackbar: SnackbarService
    ) { }

  ngAfterViewInit(): void {
    this.init(this.page, this.pageSize);
  }

  init(page: number, pageSize: number) {
    this.employeeService.GetAllEmployeeByManager(page, pageSize).subscribe(data => {
      if(data) {
        this.response = data;
        this.response.data.forEach(element => {
          element.checked = false;
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
      this.employeeService.GetAllEmployeeByManager(page, pageSize).subscribe(data => {
        if(data) {
          this.response = data;
          this.response.data.forEach(element => {
            element.checked = false;
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
    for(let i = 1; i <= this.pages.length; i++) {
      if(this.pages[i]) {
        this.pages[i].checked.forEach(element => {
          const body = {
            employeeId: element,
            unitTreeGroupId: this.id
          }
          this.employeeService.AddEmployeeUnitTree(body).subscribe(data =>{
            
          });
        });
      }
    }
    this.snackbar.openSnackbar('Thêm quản lý thành công', 2000, 'Đóng', 'center', 'bottom', true);
  }
}
