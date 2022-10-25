import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';

import { customers } from 'src/app/core/data/Customers';
import { Area } from 'src/app/core/model/Area';
import { Channel } from 'src/app/core/model/Channel';
import { Config } from 'src/app/core/model/Config';
import { CustomerGroup } from 'src/app/core/model/CustomerGroup';
import { Customers } from 'src/app/core/model/Customers';
import { CustomerType } from 'src/app/core/model/CustomerType';
import { Response } from 'src/app/core/model/Response';
import { AreaService } from 'src/app/core/services/area.service';
import { ChannelService } from 'src/app/core/services/channel.service';
import { CustomerGroupService } from 'src/app/core/services/customer-group.service';
import { CustomerTypeService } from 'src/app/core/services/customer-type.service';
import { CustomerService } from 'src/app/core/services/customer.service';
import { ProvincesService } from 'src/app/core/services/provinces.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { DetailCustomerComponent } from './detail-customer/detail-customer.component';

@Component({
    selector: 'app-customers',
    templateUrl: './customers.component.html',
    styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit, AfterViewInit {

  customerGroup: CustomerGroup[] = [];
  customerType: CustomerType[] = [];
  channel: Channel[] = [];
  area: Area[] = [];
  isProvince = false;
  hasEmployee = false;
  hasArea = false;
  customer = customers;
  role: string;
  listRole: string[] = [];
  response: Response<Customers> = {
      data: [],
      totalCount: 0,
  };
  keywords = '';
  province = '';
  district = '';
  ward = '';

  request: any = {
    keyword: '',
    page: 1,
    pageSize: 30
  };
  current_page = 1;

  page = 1;
  pageSize = 30;
  totalPage = 0;
  pageList: number[] = [];

  statusMenu: Config = {
      icon: '<i class="fa-solid fa-flag"></i>',
      title: 'Trạng thái',
      menuChildrens: ['Tất cả', 'Hoạt động', 'Không hoạt động'],
  };

  selectStatus(event: any) {
    switch(event) {
      case 'Tất cả': {
        event = null;
        break;
      }
      case 'Hoạt động': {
        event = true;
        break;
      }
      case 'Không hoạt động': {
        event = false;
        break;
      }
      default: {
        event = null;
        break;
      }
    }
    this.request.status = event;
    this.filter();
  }

  locationMenu: Config = {
      icon: '<i class="fa-solid fa-location-dot"></i>',
      title: 'Vị trí',
      menuChildrens: ['Tất cả', 'Có vị trí', 'Nghi ngờ sai vị trí', 'Sai vị trí', 'Không vị trí'],
  };

  selectLocation(event: any) {
    switch(event) {
      case 'Tất cả': {
        event = null;
        break;
      }
      case 'Có vị trí': {
        event = true;
        break;
      }
      case 'Nghi ngờ sai vị trí': {
        event = false;
        break;
      }
      case 'Sai vị trí': {
        event = false;
        break;
      }
      case 'Không vị trí': {
        event = false;
        break;
      }
      default: {
        event = null;
        break;
      }
    }
    this.request.status = event;
  }

  archiveMenu: Config = {
      icon: '<i class="fa-solid fa-briefcase"></i>',
      title: 'Lưu trữ',
      menuChildrens: ['Tất cả', 'Mở', 'Khóa'],
  };

  selectArchive(event: any) {
    switch(event) {
      case 'Tất cả': {
        event = null;
        break;
      }
      case 'Mở': {
        event = false;
        break;
      }
      case 'Khóa': {
        event = true;
        break;
      }
      default: {
        event = null;
        break;
      }
    }
    this.request.archived = event;
    this.filter();
  }

  customerMenu: Config = {
      icon: '<i class="fa-solid fa-file"></i>',
      title: 'KH có mã và không',
      menuChildrens: ['Tất cả', 'Khách hàng có mã', 'Khách hàng không có mã'],
  };

  selectCustomer(event: any) {
    switch(event) {
      case 'Tất cả': {
        event = null;
        break;
      }
      case 'Khách hàng có mã': {
        event = true;
        break;
      }
      case 'Khách hàng không có mã': {
        event = false;
        break;
      }
      default: {
        event = null;
        break;
      }
    }
    this.request.isCustomerCode = event;
    this.filter();
  }

  categoryMenu: Config = {
      icon: '<i class="fa-solid fa-grip"></i>',
      title: 'Loại khách hàng',
      menuChildrens: [
          'Tất cả',
          // 'VIP 1',
          // 'VIP 2',
          // 'VIP 3',
          // 'VIP 4',
          // 'Tiềm năng',
          // 'Thân thiết',
          // 'Vãng lai',
          // 'Không thuộc loại KH nào',
      ],
  };

  selectCategory(event: any) {
    if(event == 'Tất cả' || event == '') {
      this.request.customerTypeId = null;
      this.filter();
      return;
    }
    for(let i = 0; i < this.customerType.length; i++) {
      if(event == this.customerType[i].customerTypeName) {
        this.request.customerTypeId = this.customerType[i].id;
        this.filter();
        return;
      }
    }
  }

  groupMenu: Config = {
      icon: '<i class="fa-solid fa-users"></i>',
      title: 'Nhóm khách hàng',
      menuChildrens: ['Tất cả'],
  };

  selectGroup(event: any) {
    if(event == 'Tất cả' || event == '') {
      this.request.customerGroupId = null;
      this.filter();
      return;
    }
    for(let i = 0; i < this.customerGroup.length; i++) {
      if(event == this.customerGroup[i].customerGroupName) {
        this.request.customerGroupId = this.customerGroup[i].id;
        this.filter();
        return;
      }
    }
  }

  channelMenu: Config = {
      icon: '<i class="fa-solid fa-retweet"></i>',
      title: 'Kênh',
      menuChildrens: ['Tất cả'],
  };

  selectChannel(event: any) {
    if(event == 'Tất cả' || event == '') {
      this.request.channelId = null;
      this.filter();
      return;
    }
    for(let i = 0; i < this.channel.length; i++) {
      if(event == this.channel[i].channelName) {
        this.request.channelId = this.channel[i].id;
        this.filter();
        return;
      }
    }
  }

  listProvinces: any[] = [];
  listDistricts: any[] = [];
  listWards: any[] = [];

  constructor(
      private title: Title,
      private dialog: MatDialog,
      private customerService: CustomerService,
      private snackbar: SnackbarService,
      public datePipe: DatePipe,
      private provincesService: ProvincesService,
      private fb: FormBuilder,
      private rolesService: RolesService,
      private customerGroupService: CustomerGroupService,
      private customerTypeService: CustomerTypeService,
      private channelService: ChannelService,
      private areaService: AreaService,
  ) {}

  ngOnInit(): void {
      this.title.setTitle('Khách hàng');
      this.role = '' + localStorage.getItem('role');
      this.listRole = this.role.split(',');
      this.request.page = 1;
      this.request.pageSize = this.pageSize;
  }

  ngAfterViewInit(): void {
    this.page = 1;
    this.init(this.keywords, this.page, this.pageSize);
    this.provincesService.getListProvinces().subscribe(data => {
      this.listProvinces = data;
    });
    this.customerGroupService.get_all().subscribe(data => {
      this.customerGroup = data as CustomerGroup[];
      this.customerGroup.forEach(e => {
        this.groupMenu.menuChildrens.push(e.customerGroupName);
      });
    });
    this.customerTypeService.get_all().subscribe(data => {
      this.customerType = data as CustomerType[];
      this.customerType.forEach(e => {
        this.categoryMenu.menuChildrens.push(e.customerTypeName);
      });
    });
    this.channelService.get_all().subscribe( data => {
      this.channel = data as Channel[];
      this.channel.forEach(e => {
        this.channelMenu.menuChildrens.push(e.channelName);
      });
    });
    this.areaService.get_all().subscribe( data => {
      this.area = data as Area[];
      this.area.forEach(e => {
        this.locationMenu.menuChildrens.push(e.areaName);
      });
    });
  }

  init(keyword: any, page: number, pageSize: number) {
    const body = {
      keyword: keyword,
      page: page,
      pageSize: pageSize,
    };
    this.request.page = page;
    this.current_page = page;
    this.customerService.search(this.request).subscribe(
        (data) => {
            if(data) {
              this.response = data;
              this.totalPage = Number.parseInt((this.response.totalCount/this.pageSize).toString());
              if(this.response.totalCount % this.pageSize > 0) this.totalPage++;
              this.pageList = [];
              for(let i = 1; i <= this.totalPage; i++) {
                this.pageList.push(i);
              }
              this.response.data.forEach((element) => {
                  if (element.status == true) element.status = 'Hoạt động';
                  else if (element.status == false) element.status = 'Không hoạt động';
                  else element.status = 'Không hoạt động';
                  if(element.dob) {
                    element.dob = this.datePipe.transform(element.dob, 'dd/MM/yyyy');
                  }
              });
            }
        },
        (error) => {
            this.snackbar.openSnackbar('Không thể tải danh sách khách hàng', 2000, 'Đóng', 'center', 'bottom', true);
        },
    );
  }

  requiredRoles(role: string){
    return this.rolesService.requiredRoles(role)
  }

  add() {
    const dialogRef = this.dialog.open(AddCustomerComponent, {
      height: '100vh',
      minWidth: '1100px',
    });
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this.page = 1;
        this.init(this.keywords, this.page, this.pageSize);
      }
    });
  }

  DetailCustomer(id: any) {
    const dialogRef = this.dialog.open(DetailCustomerComponent, {
      height: '100vh',
      minWidth: '1100px',
      data: {id: id}
    })
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this.init(this.keywords, this.page, this.pageSize);
      }
    });
  }

  closeSideBar() {
    this.class = {
      left: 'w-5',
      right: 'w-full',
      statusbar: false
    }
  }

  openSideBar() {
      this.class = {
          left: 'w-2/12',
          right: 'w-10/12',
          statusbar: true,
      };
  }

  class = {
      left: 'w-2/12',
      right: 'w-10/12',
      statusbar: true,
  };

  listMenuObj = [
      {
          title: 'Lọc thời gian',
          leftTitleIcon: 'fa-calendar-days',
          listMenuPosition: [
              { title: 'Ngày tạo', leftIcon: '', value: 'all' },
              { title: 'Ngày cập nhật', leftIcon: '', value: 'emp' },
              { title: 'Sinh nhật', leftIcon: '', value: 'emp' },
          ],
      },
      {
          title: 'Sắp xếp',
          leftTitleIcon: 'fa-sort-alpha-asc',
          listMenuPosition: [
              { title: 'Tên khách hàng', leftIcon: 'fa-arrow-down', value: 'all' },
              { title: 'Tên khách hàng', leftIcon: 'fa-arrow-up', value: 'emp' },

              { title: 'Mã khách hàng', leftIcon: 'fa-arrow-down', value: 'all' },
              { title: 'Mã khách hàng', leftIcon: 'fa-arrow-up', value: 'emp' },

              // { title: 'Ngày tạo', leftIcon: 'fa-arrow-down', value: 'all' },
              // { title: 'Ngày tạo', leftIcon: 'fa-arrow-up', value: 'all' },

              // { title: 'Ngày cập nhật', leftIcon: 'fa-arrow-down', value: 'all' },
              // { title: 'Ngày cập nhật', leftIcon: 'fa-arrow-up', value: 'all' },

              // { title: 'Số lần viếng thăm', leftIcon: 'fa-arrow-down', value: 'all' },
              // { title: 'Số lần viếng thăm', leftIcon: 'fa-arrow-up', value: 'all' },

              // { title: 'Số lần đặt hàng', leftIcon: 'fa-arrow-down', value: 'all' },
              // { title: 'Số lần đặt hàng', leftIcon: 'fa-arrow-up', value: 'all' },

              // { title: 'Số lần bán hàng', leftIcon: 'fa-arrow-down', value: 'all' },
              // { title: 'Số lần bán hàng', leftIcon: 'fa-arrow-up', value: 'all' },
          ],
      },
  ];

  Select(e: any) {
      console.log(e);
  }

  selection(e: any) {
      console.log(e);
  }

  search(request: any) {
    this.page = 1;
    this.current_page = 1;
    if(request) {
      request = ('' + request).trim();
    }
    if(request == null || request == undefined) {
      this.keywords = '';
    } else {
      this.keywords = request;
    }
    this.request.keyword = this.keywords;
    this.request.page = this.page;
    this.customerService.search(this.request).subscribe(
        (data) => {
            this.response = data;
            this.totalPage = Number.parseInt((this.response.totalCount/this.pageSize).toString());
            if(this.response.totalCount % this.pageSize > 0) this.totalPage++;
            this.pageList = [];
            for(let i = 1; i <= this.totalPage; i++) {
              this.pageList.push(i);
            }
            this.response.data.forEach((element) => {
                if (element.status == true) element.status = 'Hoạt động';
                else if (element.status == false) element.status = 'Không hoạt động';
                else element.status = 'Không hoạt động';
                if(element.dob) {
                  element.dob = this.datePipe.transform(element.dob, 'dd/MM/yyyy');
                }
            });
        },
        (error) => {
            this.snackbar.openSnackbar(error, 2000, 'Đóng', 'center', 'bottom', true);
        },
    );
  }

  getDistrict(event: any) {
    this.district = '';
    this.ward = '';
    this.request.province = event;
    this.request.district = null;
    this.request.ward = null;
    this.filter();
    this.listProvinces.forEach(data => {
      if(data.name == event) {
        this.provincesService.getDistrictsListByID(data.code).subscribe(res => {
          this.listDistricts = res.districts;
        });
      }
    });
  }

  getWard(event: any) {
    this.ward = '';
    this.request.district = event;
    this.request.ward = null;
    this.filter();
    this.listDistricts.forEach(data => {
      if(data.name == event) {
        this.provincesService.getWardsListByID(data.code).subscribe(res => {
          this.listWards = res.wards;
        });
      }
    });
  }

  getAddress(event: any) {
    this.request.ward = event;
    this.filter();
  }

  searchUser(request: any) {
    const type = Number.parseInt(('' + request).split(',')[0]);
    const id = ('' + request).split(',')[1];

    if(type == 0 || type == 1) {
      this.request.groupId = id;
      this.request.employeeId = null;
    } else if(type == 2) {
      this.request.groupId = null;
      this.request.employeeId = id;
    } else {
      this.request.groupId = null;
      this.request.employeeId = null;
    }
    this.filter();
  }

  filter() {
    this.page = 1;
    this.current_page = 1;
    this.request.keyword = this.keywords;
    this.request.page = this.page;
    this.customerService.search(this.request).subscribe(
        (data) => {
            if(data) {
              this.response = data;
              this.totalPage = Number.parseInt((this.response.totalCount/this.pageSize).toString());
              if(this.response.totalCount % this.pageSize > 0) this.totalPage++;
              this.pageList = [];
              for(let i = 1; i <= this.totalPage; i++) {
                this.pageList.push(i);
              }
              this.response.data.forEach((element) => {
                  if (element.status == true) element.status = 'Hoạt động';
                  else if (element.status == false) element.status = 'Không hoạt động';
                  else element.status = 'Không hoạt động';
                  if(element.dob) {
                    element.dob = this.datePipe.transform(element.dob, 'dd/MM/yyyy');
                  }
              });
            } else {
              this.snackbar.openSnackbar('Không tìm thấy danh sách khách hàng', 2000, 'Đóng', 'center', 'bottom', true);
            }
        },
        (error) => {
            this.snackbar.openSnackbar(error, 2000, 'Đóng', 'center', 'bottom', true);
        },
    );
  }

}
