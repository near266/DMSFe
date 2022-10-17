import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Response } from 'src/app/core/model/Response';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit, AfterViewInit {

  page = 1;
  pageSize = 10;
  totalPage = 0;
  pageList: number[] = [1, 2, 3];
  response: Response<any> = {
    data: [],
    totalCount: 0
  };

  constructor(
    public dialogRef: MatDialogRef<AddEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public id: string,
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private snackbar: SnackbarService
    ) { }
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.init(this.page, this.pageSize);
  }

  init(page: number, pageSize: number) {
    this.employeeService.GetAllEmployeeByTitle('Nhân viên', page, pageSize).subscribe(data => {
      if(data) {
        this.response = data;
        this.totalPage = Number.parseInt((this.response.totalCount/this.pageSize).toString());
        if(this.response.totalCount % this.pageSize > 0) this.totalPage++;
        this.pageList = [];
        for(let i = 1; i <= this.totalPage; i++) {
          this.pageList.push(i);
        }
      }

    });
  }

  close() {
    this.dialogRef.close();
  }

}
