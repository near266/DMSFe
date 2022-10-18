import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
@Component({
  selector: 'app-add-unit',
  templateUrl: './add-unit.component.html',
  styleUrls: ['./add-unit.component.scss']
})
export class AddUnitComponent implements OnInit {

  addForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddUnitComponent>,
    @Inject(MAT_DIALOG_DATA) public id: string,
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private snackbar: SnackbarService
    ) { }

  ngOnInit(): void {
    this.addForm = this.fb.group({
      unitTreeGroup_Code: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      supervise: new FormControl(false, Validators.required)
    });
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    let body: any;
    if(this.id == 'root') {
      body = {
        unitTreeGroup_Code: this.addForm.controls['unitTreeGroup_Code'].value,
        name: this.addForm.controls['name'].value,
        supervise: this.addForm.controls['supervise'].value,
        type: 0
      }
    } else {
      body = {
        parentNodeId: this.id,
        unitTreeGroup_Code: this.addForm.controls['unitTreeGroup_Code'].value,
        name: this.addForm.controls['name'].value,
        supervise: this.addForm.controls['supervise'].value,
        type: 0
      }
    }
    this.employeeService.addGroup(body).subscribe( data => {
      this.snackbar.openSnackbar('Thêm đơn vị thành công', 2000, 'Đóng', 'center', 'bottom', true);
      this.dialogRef.close({event: true});
    }, (error) => {
      this.snackbar.openSnackbar('Thêm đơn vị thất bại', 2000, 'Đóng', 'center', 'bottom', true);
    });
  }

}
