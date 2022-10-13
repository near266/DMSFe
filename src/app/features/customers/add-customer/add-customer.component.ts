import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { customers } from 'src/app/core/data/Customers';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {

  customer = customers[0];

  isChoseUpdated = false;

  form: FormGroup;
  constructor(public dialogRef: MatDialogRef<AddCustomerComponent>, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      customerId: new FormControl('', Validators.required),
      customerCode: new FormControl('', Validators.required),
      customerName: new FormControl('', Validators.required),
      customerGroupId: new FormControl('', Validators.required),
      customerTypeId: new FormControl('', Validators.required),
      status:new FormControl(false, Validators.required),
      channelId: new FormControl('', Validators.required),
      isUpdateAddress:new FormControl(false, Validators.required),
      address: new FormControl('', Validators.required),
      deliveryAddress: new FormControl('', Validators.required),
      areaId: new FormControl('', Validators.required),
      province:  new FormControl('', Validators.required),
      district: new FormControl('', Validators.required),
      ward: new FormControl('', Validators.required),
      dOB: new FormControl('', Validators.required),
      contactName: new FormControl('', Validators.required),
      position: new FormControl('', Validators.required),
      phone:  new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      avatar: new FormControl('', Validators.required),
      debtLimit: new FormControl('', Validators.required),
      cashAcc: new FormControl('', Validators.required)
    })
  }

  close() {
    this.dialogRef.close();
  }

}
