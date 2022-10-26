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
import { SnackbarService } from 'src/app/core/services/snackbar.service';

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

  loading = true;
  tabs = 'Information';
  customerGroup: CustomerGroup[] = [];
  customerType: CustomerType[] = [];
  channel: Channel[] = [];
  area: Area[] = [];
  listProvinces: any[] = [];
  listDistricts: any[] = [];
  listWards: any[] = [];
  showArea = false;
  showProvince = false;
  showDistrict = false;
  showWard = false;
  isChoseUpdated = false;
  areaName = '';
  provinceName = '';
  districtName = '';
  wardName = '';
  areaTemp: Area[] = [];
  provinceTemp: any[]= [];
  districtTemp: any[]= [];
  wardTemp: any[]= [];



  form: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddCustomerComponent>,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private customerGroupService: CustomerGroupService,
    private customerTypeService: CustomerTypeService,
    private channelService: ChannelService,
    private areaService: AreaService,
    private snackbar: SnackbarService,
    private provincesService: ProvincesService,
    @Inject(MAT_DIALOG_DATA) public data: string,
    ) { }
  ngAfterViewInit(): void {
    let count = 0;
    this.customerGroupService.get_all().subscribe(data => {
      this.customerGroup = data as CustomerGroup[];
      count++;
      if(count == 5) {
        this.loading = false;
      }
    });
    this.customerTypeService.get_all().subscribe(data => {
      this.customerType = data;
      count++;
      if(count == 5) {
        this.loading = false;
      }
    });
    this.channelService.get_all().subscribe( data => {
      this.channel = data;
      count++;
      if(count == 5) {
        this.loading = false;
      }
    });
    this.areaService.get_all().subscribe( data => {
      this.area = data;
      this.areaTemp = this.area;
      count++;
      if(count == 5) {
        this.loading = false;
      }
    });
    this.provincesService.getListProvinces().subscribe(data => {
      this.listProvinces = data;
      this.provinceTemp = this.listProvinces;
      count++;
      if(count == 5) {
        this.loading = false;
      }
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      // customerId: new FormControl(''),
      customerCode: new FormControl(''),
      customerName: new FormControl(''),
      customerGroupId: new FormControl(''),
      customerTypeId: new FormControl(''),
      status: new FormControl(true),
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
    this.form.controls['district'].setValue('');
    this.districtName = '';
    this.form.controls['ward'].setValue('');
    this.wardName = '';
    this.listProvinces.forEach(data => {
      if(data.name == event) {
        this.provincesService.getDistrictsListByID(data.code).subscribe(res => {
          this.listDistricts = res.districts;
          this.districtTemp = this.listDistricts;
        });
      }
    });
  }

  getWard(event: any) {
    this.form.controls['ward'].setValue('');
    this.wardName = '';
    this.listDistricts.forEach(data => {
      if(data.name == event) {
        this.provincesService.getWardsListByID(data.code).subscribe(res => {
          this.listWards = res.wards;
          this.wardTemp = this.listWards;
        });
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  add() {
    this.loading = true;
    let body = {
      // id: this.form.controls['customerGroupId'].value,
      // customerCode: this.form.controls['customerCode'].value,
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
      this.loading = false;
      this.snackbar.openSnackbar('Thêm khách hàng thành công', 2000, 'Đóng', 'center', 'bottom', true);
      this.dialogRef.close({event: true});
    }, (error) => {
      this.loading = false;
      this.snackbar.openSnackbar('Thêm khách hàng không thành công, vui lòng kiểm tra thông tin đã nhập', 2000, 'Đóng', 'center', 'bottom', true);
    });

  }

  selectArea(value: any) {
    this.showArea = false;
    this.areaName = value.areaName;
    this.form.controls['areaId'].setValue(value.id);
  }
  searchArea() {
    if(this.areaName != '') {
      this.areaTemp = [];
      this.area.forEach((element) => {
        if(this.removeVietnameseTones(element.areaName.toLowerCase()).includes(this.removeVietnameseTones(this.areaName.toLowerCase()))) {
          this.areaTemp.push(element);
        }
      });
    } else {
      this.areaTemp = this.area;
    }

  }

  selectProvince(value: any) {
    this.showProvince = false;
    this.provinceName = value.name;
    this.form.controls['province'].setValue(value.name);
    this.getDistrict(value.name);
  }

  searchProvince() {
    if(this.provinceName != '') {
      this.provinceTemp = [];
      this.listProvinces.forEach((element) => {
        if(this.removeVietnameseTones(element.name.toLowerCase()).includes(this.removeVietnameseTones(this.provinceName.toLowerCase()))) {
          this.provinceTemp.push(element);
        }
      });
    } else {
      this.provinceTemp = this.listProvinces;
    }
  }

  selectDistrict(value: any) {
    this.showDistrict = false;
    this.districtName = value.name;
    this.form.controls['district'].setValue(value.name);
    this.getWard(value.name);
  }

  searchDistrict() {
    if(this.districtName != '') {
      this.districtTemp = [];
      this.listProvinces.forEach((element) => {
        if(this.removeVietnameseTones(element.name.toLowerCase()).includes(this.removeVietnameseTones(this.districtName.toLowerCase()))) {
          this.districtTemp.push(element);
        }
      });
    } else {
      this.wardTemp = this.listWards;
    }
  }

  selectWard(value: any) {
    this.showWard = false;
    this.wardName = value.name;
    this.form.controls['ward'].setValue(value.name);
  }

  searchWard() {
    if(this.wardName != '') {
      this.wardTemp = [];
      this.listWards.forEach((element) => {
        if(this.removeVietnameseTones(element.name.toLowerCase()).includes(this.removeVietnameseTones(this.wardName.toLowerCase()))) {
          this.wardTemp.push(element);
        }
      });
    } else {
      this.wardTemp = this.listWards;
    }
  }

  removeVietnameseTones(str: any) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
    str = str.replace(/\u02C6|\u0306|\u031B/g, '');
    str = str.replace(/ + /g, ' ');
    str = str.trim();
    str = str.replace(
      /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
      ' '
    );
    return str;
  }

  unfocus() {
    if(this.showArea == true || this.showProvince == true || this.showDistrict == true || this.showWard == true) {
      this.showArea = false;
      this.showProvince = false;
      this.showDistrict = false;
      this.showWard = false;
    }
  }

}
