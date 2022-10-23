import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';

import { customers } from 'src/app/core/data/Customers';
import { Config } from 'src/app/core/model/Config';
import { Customers } from 'src/app/core/model/Customers';
import { Response } from 'src/app/core/model/Response';
import { CustomerService } from 'src/app/core/services/customer.service';
import { ProvincesService } from 'src/app/core/services/provinces.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { DetailCustomerComponent } from './detail-customer/detail-customer.component';

@Component({
    selector: 'app-customers',
    templateUrl: './customers.component.html',
    styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit, AfterViewInit {
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
  request: any;
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
      menuChildrens: ['Tất cả', 'Hoạt động', 'Không hoạt động'],
  };

  selectArchive(event: any) {
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
  }

  categoryMenu: Config = {
      icon: '<i class="fa-solid fa-grip"></i>',
      title: 'Loại khách hàng',
      menuChildrens: [
          'Tất cả',
          'VIP 1',
          'VIP 2',
          'VIP 3',
          'VIP 4',
          'Tiềm năng',
          'Thân thiết',
          'Vãng lai',
          'Không thuộc loại KH nào',
      ],
  };

  selectCategory(event: any) {
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
  }

  groupMenu: Config = {
      icon: '<i class="fa-solid fa-users"></i>',
      title: 'Nhóm khách hàng',
      menuChildrens: ['Tất cả', 'Hợp đồng', 'KH lẻ', 'Không thuộc nhóm KH nào'],
  };

  selectGroup(event: any) {
    switch(event) {
      case 'Tất cả': {
        event = null;
        break;
      }
      case 'Hợp đồng': {
        event = true;
        break;
      }
      case 'KH lẻ': {
        event = false;
        break;
      }
      case 'Không thuộc nhóm KH nào': {
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

  channelMenu: Config = {
      icon: '<i class="fa-solid fa-retweet"></i>',
      title: 'Kênh',
      menuChildrens: ['Tất cả', 'OTC', 'ETC', 'Không thuộc kênh nào'],
  };

  selectChannel(event: any) {
    switch(event) {
      case 'Tất cả': {
        event = null;
        break;
      }
      case 'Hợp đồng': {
        event = true;
        break;
      }
      case 'KH lẻ': {
        event = false;
        break;
      }
      case 'Không thuộc nhóm KH nào': {
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
      private fb: FormBuilder
  ) {}

  ngOnInit(): void {
      this.title.setTitle('Khách hàng');
      this.role = '' + localStorage.getItem('role');
      this.listRole = this.role.split(',');
  }

  ngAfterViewInit(): void {
    this.page = 1;
    this.init(this.keywords, this.page, this.pageSize);
    this.provincesService.getListProvinces().subscribe(data => {
      this.listProvinces = data;
    });
  }

  init(keyword: any, page: number, pageSize: number) {
    const body = {
      keyword: keyword,
      page: page,
      pageSize: pageSize,
    };
    this.current_page = page;
    this.customerService.search(body).subscribe(
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
    if(request == null || request == undefined) {
      this.keywords = '';
    } else {
      this.keywords = request;
    }
    const body = {
      keyword: this.keywords,
      page: this.page,
      pageSize: this.pageSize,
    };
    this.customerService.search(body).subscribe(
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
    this.listDistricts.forEach(data => {
      if(data.name == event) {
        this.provincesService.getWardsListByID(data.code).subscribe(res => {
          this.listWards = res.wards;
        });
      }
    });
  }

}
