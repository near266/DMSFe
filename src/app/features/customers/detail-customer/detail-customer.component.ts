import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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


export interface InData{
  id: string;
}

export interface IBody{
  id?: any,
  customerCode?: any,
  customerName?: any,
  customerGroupId?: any,
  customerTypeId?: any,
  channelId?: any,
  areaId?: any,
  status: true,
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

  customer: Customers = {
    id: '',

  };

  buf: IBody;

  customerGroup: CustomerGroup[] = [];
  customerType: CustomerType[] = [];
  channel: Channel[] = [];
  area: Area[] = [];
  listProvinces: any[] = [];
  listDistricts: any[] = [];
  listWards: any[] = [];
  isChoseUpdated = false;

  constructor(
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<DetailCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InData,
    private customerService: CustomerService,
    private customerGroupService: CustomerGroupService,
    private customerTypeService: CustomerTypeService,
    private channelService: ChannelService,
    private areaService: AreaService,
    private provincesService: ProvincesService
    ) { }

  ngOnInit(): void {
    this.customerService.get_by_id(this.data.id).subscribe(data => {
      this.customer = data as Customers;
      this.buf = {
        id: '' + this.customer.id,
        customerCode: '' + this.customer.customerCode,
        customerName: '' + this.customer.customerName,
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
      this.provincesService.getListProvinces().subscribe(data => {
        this.listProvinces = data;
        this.initDistrict(this.buf.province);
        this.initWard(this.buf.district);
      });
    });

  }

  convert(date: any): string {
    if(date) {
      return '' + this.datePipe.transform(date, 'yyyy-MM-dd');
    } else {
      return '';
    }
  }

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


  }

  getDistrict(event: any) {
    this.buf.district = '';
    this.buf.ward = '';
    this.listProvinces.forEach(data => {
      if(data.name == event) {
        this.provincesService.getDistrictsListByID(data.code).subscribe(res => {
          this.listDistricts = res.districts;
        });
      }
    });
  }

  initDistrict(event: any) {
    this.listProvinces.forEach(data => {
      if(data.name == event) {
        this.provincesService.getDistrictsListByID(data.code).subscribe(res => {
          this.listDistricts = res.districts;
          this.getWard(this.buf.district);
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
        });
      }
    });
  }
  initWard(event: any) {
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

  submit() {
    try {
      this.buf.dob = new Date(this.buf.dob).toISOString();
    } catch (error) {
      this.buf.dob = null;
    }
    this.customerService.update(this.buf).subscribe(data => {
      this.dialogRef.close({event: true});
    });
  }

}
