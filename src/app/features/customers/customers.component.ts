import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { customers } from 'src/app/core/data/Customers';
import { Config } from 'src/app/core/model/Config';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { DetailCustomerComponent } from './detail-customer/detail-customer.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  isProvince = false;
  hasEmployee = false;
  hasArea = false;
  customer = customers;

  statusMenu: Config = {
    icon: '<i class="fa-solid fa-flag"></i>',
    title: 'Trạng thái',
    menuChildrens: [
        'Tất cả',
        'Hoạt động',
        'Không hoạt động',
    ],
  };
  locationMenu: Config = {
    icon: '<i class="fa-solid fa-location-dot"></i>',
    title: 'Vị trí',
    menuChildrens: [
        'Tất cả',
        'Có vị trí',
        'Nghi ngờ sai vị trí',
        'Sai vị trí',
        'Không vị trí'
    ],
  };

  archiveMenu: Config = {
    icon: '<i class="fa-solid fa-briefcase"></i>',
    title: 'Lưu trữ',
    menuChildrens: [
        'Tất cả',
        'Hoạt động',
        'Không hoạt động',
    ],
  };

  customerMenu: Config = {
    icon: '<i class="fa-solid fa-file"></i>',
    title: 'KH có mã và không',
    menuChildrens: [
        'Tất cả',
        'Khách hàng có mã',
        'Khách hàng không có mã'
    ],
  };

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

  groupMenu: Config = {
    icon: '<i class="fa-solid fa-users"></i>',
    title: 'Nhóm khách hàng',
    menuChildrens: [
        'Tất cả',
        'Hợp đồng',
        'KH lẻ',
        'Không thuộc nhóm KH nào'
    ],
  };

  channelMenu: Config = {
    icon: '<i class="fa-solid fa-retweet"></i>',
    title: 'Kênh',
    menuChildrens: [
        'Tất cả',
        'OTC',
        'ETC',
        'Không thuộc kênh nào'
    ],
  };

  constructor(
    private title: Title,
    private dialog: MatDialog
  ) { }

  add() {
    this.dialog.open(AddCustomerComponent, {
      height: '100vh',
      minWidth: '1100px',
    })
  }

  DetailCustomer(id: any) {
    this.dialog.open(DetailCustomerComponent, {
      height: '100vh',
      minWidth: '1100px',
      data: {
        id: id,
        status: 'view'
      }
    })
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
      statusbar: true
    }
  }

  class = {
    left: 'w-2/12',
    right: 'w-10/12',
    statusbar: true
  }


  ngOnInit(): void {
    this.title.setTitle('Khách hàng - DMS.Delap')
  }
  listMenuObj = [
    {
      title: 'Lọc thời gian',
      leftTitleIcon: 'fa-calendar-days',
      listMenuPosition: [
        { title: 'Ngày tạo', leftIcon: '', value: 'all' },
        { title: 'Ngày cập nhật', leftIcon: '', value: 'emp' },
        { title: 'Sinh nhật', leftIcon: '', value: 'emp' },
      ]
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
      ]
    }
  ]


  Select(e: any) {
    console.log(e);

  }
  selection(e: any) {
    console.log(e);
}

}