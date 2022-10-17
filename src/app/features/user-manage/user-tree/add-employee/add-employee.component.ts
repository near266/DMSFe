import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {

  page = 1;
  pageSize = 30;
  totalPage = 0;
  pageList: number[] = [1, 2, 3];

  constructor(
    public dialogRef: MatDialogRef<AddEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public id: string,
    private fb: FormBuilder,
    // private employeeService: EmployeeService,
    private snackbar: SnackbarService
    ) { }
  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

}
