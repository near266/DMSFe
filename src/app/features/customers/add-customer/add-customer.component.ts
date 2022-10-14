import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { customers } from 'src/app/core/data/Customers';
import { Area } from 'src/app/core/model/Area';
import { Channel } from 'src/app/core/model/Channel';
import { CustomerGroup } from 'src/app/core/model/CustomerGroup';
import { CustomerType } from 'src/app/core/model/CustomerType';
import { AreaService } from 'src/app/core/services/area.service';
import { ChannelService } from 'src/app/core/services/channel.service';
import { CustomerGroupService } from 'src/app/core/services/customer-group.service';
import { CustomerTypeService } from 'src/app/core/services/customer-type.service';
import { CustomerService } from 'src/app/core/services/customer.service';
import { ProvincesService } from 'src/app/core/services/provinces.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit, AfterViewInit {

  customer = customers[0];
  customerGroup: CustomerGroup[] = [];
  customerType: CustomerType[] = [];
  channel: Channel[] = [];
  area: Area[] = [];
  listProvinces: any[] = [];
  current_province = '';
  listDistricts: any[] = [];
  current_district = '';
  listWards: any[] = [];
  current_ward = '';

  isChoseUpdated = false;

  form: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddCustomerComponent>,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private customerGroupService: CustomerGroupService,
    private customerTypeService: CustomerTypeService,
    private channelService: ChannelService,
    private areaService: AreaService,
    private provincesService: ProvincesService
    ) { }
  ngAfterViewInit(): void {
    this.customerGroupService.get_all().subscribe(data => {
      this.customerGroup = data as CustomerGroup[];
    });
    this.customerTypeService.get_all().subscribe(data => {
      this.customerType = data;
    });
    this.channelService.get_all().subscribe( data => {
      this.channel = data;
    });
    this.areaService.get_all().subscribe( data => {
      this.area = data;
    });
    this.provincesService.getListProvinces().subscribe(data => {
      this.listProvinces = data;
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      // customerId: new FormControl(''),
      // customerCode: new FormControl('', Validators.required),
      customerName: new FormControl(''),
      customerGroupId: new FormControl(''),
      customerTypeId: new FormControl(''),
      status: new FormControl(false),
      channelId: new FormControl(''),
      // isUpdateAddress: new FormControl(false),
      address: new FormControl(''),
      deliveryAddress: new FormControl(''),
      areaId: new FormControl(''),
      province:  new FormControl(''),
      district: new FormControl(''),
      ward: new FormControl(''),
      dob: new FormControl(''),
      contactName: new FormControl(''),
      position: new FormControl(''),
      phone:  new FormControl(''),
      email: new FormControl(''),
      avatar: new FormControl(''),
      debtLimit: new FormControl(''),
      cashAcc: new FormControl('')
    })
  }

  getDistrict(event: any) {
    this.listProvinces.forEach(data => {
      if(data.name == event) {
        this.provincesService.getDistrictsListByID(data.code).subscribe(res => {
          this.listDistricts = res.districts;
        });
      }
    });
  }

  getWard(event: any) {
    this.listDistricts.forEach(data => {
      if(data.name == event) {
        this.provincesService.getWardsListByID(data.code).subscribe(res => {
          this.listWards = res.wards;
        });
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  add() {
    const body = {
      customerName: this.form.controls['customerName'].value,
      customerGroupId: this.form.controls['customerGroupId'].value,
      customerTypeId: this.form.controls['customerTypeId'].value,
      status: this.form.controls['status'].value,
      channelId: this.form.controls['channelId'].value,
      // isUpdateAddress: new FormControl(false),
      address: this.form.controls['address'].value,
      deliveryAddress: this.form.controls['deliveryAddress'].value,
      areaId: this.form.controls['areaId'].value,
      province:  this.form.controls['province'].value,
      district: this.form.controls['district'].value,
      ward: this.form.controls['ward'].value,
      dob: new Date(this.form.controls['dob'].value).toISOString(),
      contactName: this.form.controls['contactName'].value,
      position: this.form.controls['position'].value,
      phone:  this.form.controls['phone'].value,
      email: this.form.controls['email'].value,
      avatar: this.form.controls['avatar'].value,
      debtLimit: this.form.controls['debtLimit'].value,
      cashAcc: this.form.controls['cashAcc'].value
    }
    console.log(body);
    this.customerService.add(body).subscribe(data => {
      console.log(data);

    });
  }

}
