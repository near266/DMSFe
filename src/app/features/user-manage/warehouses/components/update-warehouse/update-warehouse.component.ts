import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-warehouse',
  templateUrl: './update-warehouse.component.html',
  styleUrls: ['./update-warehouse.component.scss']
})
export class UpdateWarehouseComponent implements OnInit {

  title = 'Thông tin chung';

  tabList = [
    { title: 'Thông tin chung', leftIcon: 'fa-regular fa-file-lines' },
  ]

  constructor(
    public dialogRef: MatDialogRef<UpdateWarehouseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  ngOnInit(): void {
    console.log(this.data);

  }

  DeleteWareHouse() {

  }

}
