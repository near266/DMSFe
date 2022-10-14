import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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

export interface IBody {
  // id: this.form.controls['customerGroupId'].value,
  // customerCode: this.form.controls['customerCode'].value,
  customerName?: any,
  customerGroupId?: any,
  customerTypeId?: any,
  status?: any,
  channelId?: any,
  // isUpdateAddress?: new FormControl(false),
  address?: any,
  deliveryAddress?: any,
  areaId?: any,
  province?:  any,
  district?: any,
  ward?: any,
  dob?: any,
  contactName?: any,
  position?: any,
  phone?:  any,
  email?: any,
  avatar?: any,
  debtLimit?: any,
  cashAcc?: any
};
@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit, AfterViewInit {

  customerGroup: CustomerGroup[] = [];
  customerType: CustomerType[] = [];
  channel: Channel[] = [];
  area: Area[] = [];
  listProvinces: any[] = [];
  listDistricts: any[] = [];
  listWards: any[] = [];

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
    private provincesService: ProvincesService,
    @Inject(MAT_DIALOG_DATA) public data: string,
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
      customerCode: new FormControl(''),
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
    let body = {
      // id: this.form.controls['customerGroupId'].value,
      customerCode: this.form.controls['customerCode'].value,
      customerName: this.form.controls['customerName'].value !== '' ? this.form.controls['customerName'].value: null,
      customerGroupId: this.form.controls['customerGroupId'].value !== '' ? this.form.controls['customerGroupId'].value: null,
      customerTypeId: this.form.controls['customerTypeId'].value !== '' ? this.form.controls['customerTypeId'].value: null,
      status: this.form.controls['status'].value !== '' ? this.form.controls['status'].value: false,
      channelId: this.form.controls['channelId'].value !== '' ? this.form.controls['channelId'].value: null,
      // isUpdateAddress: new FormControl(false),
      address: this.form.controls['address'].value !== '' ? this.form.controls['address'].value: null,
      deliveryAddress: this.form.controls['deliveryAddress'].value !== '' ? this.form.controls['deliveryAddress'].value: null,
      areaId: this.form.controls['areaId'].value !== '' ? this.form.controls['areaId'].value: null,
      province:  this.form.controls['province'].value !== '' ? this.form.controls['province'].value: null,
      district: this.form.controls['district'].value !== '' ? this.form.controls['district'].value: null,
      ward: this.form.controls['ward'].value !== '' ? this.form.controls['ward'].value: null,
      dob: this.form.controls['dob'].value ? new Date(this.form.controls['dob'].value).toISOString(): null,
      contactName: this.form.controls['contactName'].value !== '' ? this.form.controls['customerName'].value: null,
      position: this.form.controls['position'].value !== '' ? this.form.controls['position'].value: null,
      phone:  this.form.controls['phone'].value !== '' ? this.form.controls['phone'].value: null,
      email: this.form.controls['email'].value !== '' ? this.form.controls['email'].value: null,
      avatar: this.form.controls['avatar'].value !== '' ? this.form.controls['avatar'].value: null,
      debtLimit: this.form.controls['debtLimit'].value !== '' ? this.form.controls['debtLimit'].value: null,
      cashAcc: this.form.controls['cashAcc'].value !== '' ? this.form.controls['cashAcc'].value: null
    }

    if(body.status == 'true') {
      body.status = true;
    } else if(body.status == 'false') {
      body.status = false;
    }

    this.customerService.add(body).subscribe(data => {
      console.log(data);
      this.dialogRef.close({event: true});
    });

  }

}
