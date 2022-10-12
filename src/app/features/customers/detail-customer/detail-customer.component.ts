import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-detail-customer',
  templateUrl: './detail-customer.component.html',
  styleUrls: ['./detail-customer.component.scss']
})
export class DetailCustomerComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DetailCustomerComponent>) { }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

}
