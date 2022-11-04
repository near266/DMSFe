import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

export interface Node {
  unitTreeGroup_Code: string
  name: string
  workScheduleType: number
  type: number
  supervise: any
  isLeaf: boolean
  quantityChildrenOfNode: number
  heightOfNode: number
  levelOfNode: number
  id: string
  createdBy: string
  createdDate: string
  lastModifiedBy: string
  lastModifiedDate: string
}

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements OnInit, AfterViewInit {

  addForm: FormGroup;
  response: Node = {
    unitTreeGroup_Code: '',
    name: '',
    workScheduleType: 0,
    type: 0,
    supervise: false,
    isLeaf: false,
    quantityChildrenOfNode: 0,
    heightOfNode: 0,
    levelOfNode: 0,
    id: '',
    createdBy: '',
    createdDate: '',
    lastModifiedBy: '',
    lastModifiedDate: ''
  };

  constructor(
    public dialogRef: MatDialogRef<EditGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public id: string,
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private snackbar: SnackbarService
    ) { }
  ngAfterViewInit(): void {
    this.employeeService.GetGroupById(this.id).subscribe( data => {
      this.response = data;
      this.addForm.controls['name'].setValue(this.response.name);
      this.addForm.controls['unitTreeGroup_Code'].setValue(this.response.unitTreeGroup_Code);
      if(this.response.supervise == true) {
        this.addForm.controls['supervise'].setValue(this.response.supervise);
      }
    });
  }

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
