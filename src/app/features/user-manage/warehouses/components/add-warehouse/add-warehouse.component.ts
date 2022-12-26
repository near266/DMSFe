import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-warehouse',
  templateUrl: './add-warehouse.component.html',
  styleUrls: ['./add-warehouse.component.scss']
})
export class AddWarehouseComponent implements OnInit {

  title = 'Thông tin chung';
  submit: boolean;

  tabList = [
    { title: 'Thông tin chung', leftIcon: 'fa-regular fa-file-lines' },
  ]

  constructor(public dialogRef: MatDialogRef<AddWarehouseComponent>) { }

  ngOnInit(): void {
    this.submit = false;
  }

  save() {
    this.submit = true;
  }

  signal(event: boolean) {
    if(event == true) {
        this.dialogRef.close({event: true});
        return;
    }
    Promise.resolve().then( () => {
        this.submit = event;

    });
  }

}
