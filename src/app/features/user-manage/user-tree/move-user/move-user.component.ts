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

  constructor(
    public dialogRef: MatDialogRef<MoveUserComponent>,
    @Inject(MAT_DIALOG_DATA) public id: string,
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private snackbar: SnackbarService
  ) { }

  ngAfterViewInit(): void {
    this.employeeService.GetAllGroupByType(0).subscribe((data: any[]) => {
      if(data) {
        data.forEach(element => {
          this.listAllGroup.push(element);
          this.bufferGroup.push(element);
        });
      }
    });
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

  close() {
    this.dialogRef.close();
  }

}
