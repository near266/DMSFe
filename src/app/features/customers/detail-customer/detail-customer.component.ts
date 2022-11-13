import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { customers } from 'src/app/core/data/Customers';
import { Area } from 'src/app/core/model/Area';
import { Channel } from 'src/app/core/model/Channel';
import { CustomerGroup } from 'src/app/core/model/CustomerGroup';
import { Customers } from 'src/app/core/model/Customers';
import { CustomerType } from 'src/app/core/model/CustomerType';
import { AreaService } from 'src/app/core/services/area.service';
import { ChannelService } from 'src/app/core/services/channel.service';
import { CustomerGroupService } from 'src/app/core/services/customer-group.service';
import { CustomerTypeService } from 'src/app/core/services/customer-type.service';
import { CustomerService } from 'src/app/core/services/customer.service';
import { ProvincesService } from 'src/app/core/services/provinces.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ConfirmDialogService } from 'src/app/core/shared/services/confirm-dialog.service';
import { AddRouteComponent } from '../add-route/add-route.component';


export interface InData{
  id: string;
  archived: boolean;
}

export interface IBody{
  id?: any,
  // customerPrefix?: any,
  customerCode?: any,
  customerName?: any,
  customerGroupId?: any,
  customerTypeId?: any,
  channelId?: any,
  areaId?: any,
  status?: any,
  address?: any,
  deliveryAddress?: any,
  province?: any,
  district?: any,
  ward?: any,
  dob?: any,
  contactName?: any,
  position?: any,
  phone?: any,
  email?: any,
  avatar?: any,
  debtLimit?: any,
  cashAcc?: any,
}
@Component({
  selector: 'app-detail-customer',
  templateUrl: './detail-customer.component.html',
  styleUrls: ['./detail-customer.component.scss']
})
export class DetailCustomerComponent implements OnInit {

  loading = false;
  title = '';

  customer: Customers = {
    id: '',

  };
  listRole: string[] = [];

  tabs = 'Information';

  buf: IBody;

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

  constructor(
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<DetailCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InData,
    private customerService: CustomerService,
    private customerGroupService: CustomerGroupService,
    private customerTypeService: CustomerTypeService,
    private channelService: ChannelService,
    private areaService: AreaService,
    private provincesService: ProvincesService,
    private snackbar: SnackbarService,
    private rolesService: RolesService,
    private dialog: MatDialog,
    private confirm: ConfirmDialogService
    ) { }

  ngOnInit(): void {
    this.listRole = ('' + localStorage.getItem('role')).split(',');
  }

  convert(date: any): string {
    if(date) {
      return '' + this.datePipe.transform(date, 'yyyy-MM-dd');
    } else {
      return '';
    }
  }

  ngAfterViewInit(): void {
    this.customerService.get_by_id(this.data.id).subscribe(data => {
      this.loading = false;
      this.customer = data as Customers;
      this.title = '' + this.customer.customerName + ' - '+ this.customer.customerCode;
      if(this.title.length > 80) this.title = this.title.substring(0,80) + '...';
      this.buf = {
        id: '' + this.customer.id,
        customerCode: '' + this.customer.customerCode,
        // customerPrefix: null,
        customerName: this.customer.customerName ? this.customer.customerName : '',
        customerGroupId: this.customer.customerGroup ? this.customer.customerGroup.id : null,
        customerTypeId: this.customer.customerType ? this.customer.customerType.id : null,
        channelId: this.customer.channel ? this.customer.channel.id : null,
        areaId: this.customer.area ? this.customer.area.id : null,
        status: this.customer.status ? this.customer.status: false,
        address: this.customer.address ? this.customer.address : null,
        deliveryAddress: this.customer.deliveryAddress ? this.customer.deliveryAddress : null,
        province: this.customer.province ? this.customer.province : null,
        district: this.customer.district? this.customer.district : null,
        ward: this.customer.ward ? this.customer.ward : null,
        dob: this.convert(this.customer.dob),
        contactName: this.customer.contactName ? this.customer.contactName : null,
        position: this.customer.position ? this.customer.position : null,
        phone: this.customer.phone? this.customer.phone : null,
        email: this.customer.email? this.customer.email: null,
        avatar: null,
        debtLimit: this.customer.debtLimit ? this.customer.debtLimit : null,
        cashAcc: this.customer.cashAcc? this.customer.cashAcc : null,
      };
      if (this.customer.status == true) this.customer.status = 'Hoạt động';
      else if (this.customer.status == false) this.customer.status = 'Không hoạt động';
      else this.customer.status = 'Không hoạt động';
      if(this.customer.dob) {
        this.customer.dob = this.datePipe.transform(this.customer.dob, 'dd/MM/yyyy');
      }

      this.provinceName = this.buf.province;
      this.areaService.get_all().subscribe( data => {
        this.area = data;
        this.areaTemp = this.area;
        for(let i = 0; i < this.area.length; i++) {
          if(this.buf.areaId == this.area[i].id) {
            this.areaName = this.area[i].areaName;
          }
        }
      });

      this.provincesService.getListProvinces().subscribe(data => {
        this.listProvinces = data;
        this.initDistrict(this.buf.province);
      });
    });

    this.customerGroupService.get_all().subscribe(data => {
      this.customerGroup = data as CustomerGroup[];
    });
    this.customerTypeService.get_all().subscribe(data => {
      this.customerType = data;
    });
    this.channelService.get_all().subscribe( data => {
      this.channel = data;
    });



  }

  getDistrict(event: any) {
    this.buf.district = '';
    this.buf.ward = '';
    this.listProvinces.forEach(data => {
      if(data.name == event) {
        this.provincesService.getDistrictsListByID(data.code).subscribe(res => {
          this.listDistricts = res.districts;
          this.districtTemp = this.listDistricts;
        });
      }
    });
  }

  initDistrict(event: any) {
    this.listProvinces.forEach(data => {
      if(data.name == event) {
        this.provincesService.getDistrictsListByID(data.code).subscribe(res => {
          this.listDistricts = res.districts;
          this.districtTemp = this.listDistricts;
          this.initWard(this.buf.district);
        });
      }
    });
  }

  getWard(event: any) {
    this.buf.ward = '';
    this.listDistricts.forEach(data => {
      if(data.name == event) {
        this.provincesService.getWardsListByID(data.code).subscribe(res => {
          this.listWards = res.wards;
          this.wardTemp = this.listWards;
        });
      }
    });
  }
  initWard(event: any) {
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

  archived() {
    let ref = this.confirm.openDialog({message: 'Bạn có chắc chắn muốn xóa khách hàng này?', confirm: 'Đồng ý', cancel: 'Hủy'});
    ref.subscribe(data => {
      if(data) {
        this.loading = true;
        const body = {
          id: this.data.id,
          archived: true
        };
        this.customerService.archivedCustomer(body).subscribe(data => {
          if(data.message == true) {
            this.loading = false;
            this.snackbar.openSnackbar('Xóa khách hàng thành công', 2000, 'Đóng', 'center', 'bottom', true);
            this.dialogRef.close({event: true});
          } else {
            this.loading = false;
            this.snackbar.openSnackbar('Xóa khách hàng thất bại', 2000, 'Đóng', 'center', 'bottom', false);
          }
        }, (error) => {
          this.loading = false;
          this.snackbar.openSnackbar('Xóa khách hàng thất bại', 2000, 'Đóng', 'center', 'bottom', false);
        });
      }
    });

  }

  requiredRoles(role: string){
    return this.rolesService.requiredRoles(role)
  }

  submit() {
    this.loading = true;
    try {
      this.buf.dob = new Date(this.buf.dob).toISOString();
    } catch (error) {
      this.buf.dob = null;
    }
    if(this.buf.status == 'true') {
      this.buf.status = true;
    } else if(this.buf.status == 'false') {
      this.buf.status = false;
    }
    this.customerService.update(this.buf).subscribe(data => {
      this.loading = false;
      this.snackbar.openSnackbar('Chỉnh sửa thông tin khách hàng thành công', 2000, 'Đóng', 'center', 'bottom', true);
      this.dialogRef.close({event: true});
    }, (error) => {
      this.loading = false;
      this.snackbar.openSnackbar('Chỉnh sửa thông tin khách hàng không thành công, vui lòng kiểm tra lại thông tin chỉnh sửa', 2000, 'Đóng', 'center', 'bottom', true);
    });
  }

  selectArea(value: any) {
    this.showArea = false;
    this.areaName = value.areaName;
    this.buf.areaId = value.id;
    // this.form.controls['areaId'].setValue(value.id);
  }
  searchArea() {
    this.areaTemp = [];
    this.area.forEach((element) => {
      if(this.removeVietnameseTones(element.areaName.toLowerCase()).includes(this.removeVietnameseTones(this.areaName.toLowerCase()))) {
        this.areaTemp.push(element);
      }
    });
  }

  selectProvince(value: any) {
    this.showProvince = false;
    this.buf.province = value.name;
    // this.form.controls['province'].setValue(value.name);
    this.getDistrict(value.name);
  }

  searchProvince() {
    this.provinceTemp = [];
    this.listProvinces.forEach((element) => {
      if(this.removeVietnameseTones(element.name.toLowerCase()).includes(this.removeVietnameseTones(this.buf.province.toLowerCase()))) {
        this.provinceTemp.push(element);
      }
    });
  }

  selectDistrict(value: any) {
    this.showDistrict = false;
    this.districtName = value.name;
    this.buf.district = value.name;
    this.getWard(value.name);
  }

  searchDistrict() {
    if(this.buf.district != '') {
      this.districtTemp = [];
      this.listDistricts.forEach((element) => {
        if(this.removeVietnameseTones(element.name.toLowerCase()).includes(this.removeVietnameseTones(this.buf.district.toLowerCase()))) {
          this.districtTemp.push(element);
        }
      });
    } else {
      this.districtTemp = this.listDistricts;
    }
  }

  selectWard(value: any) {
    this.showWard = false;
    this.wardName = value.name;
    this.buf.ward = value.name;
  }

  searchWard() {
    if(this.buf.ward != '') {
      this.wardTemp = [];
      this.listWards.forEach((element) => {
        if(this.removeVietnameseTones(element.name.toLowerCase()).includes(this.removeVietnameseTones(this.buf.ward.toLowerCase()))) {
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

}
