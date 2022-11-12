import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Config } from 'src/app/core/model/Config';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent implements OnInit, AfterViewInit {

  now: any;
  loading = false;
  hasEmployee = false;

  positionMenu: Config = {
    icon: '<i class="fa-solid fa-filter"></i>',
    title: 'Lọc theo chức danh',
    menuChildrens: ['Tất cả', 'Nhân viên', 'Kế toán', 'Giám sát', 'Chủ sở hữu'],
  };

  statusMenu: Config = {
    icon: '<i class="fa-solid fa-filter"></i>',
    title: 'Trạng thái nhân viên',
    menuChildrens: ['Tất cả', 'Hoạt động', 'Không hoạt động'],
  };

  timekeepingMenu: Config = {
    icon: '<i class="fa-solid fa-filter"></i>',
    title: 'Chấm công hôm nay',
    menuChildrens: ['Tất cả', 'Đã chấm công'],
  };

  selectPosition(event: any) {

  }

  selectStatus(event: any) {

  }

  selectTimekeeping(event: any) {

  }

  constructor(
    private datePipe: DatePipe,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Báo cáo chấm công tháng');
    let date = new Date();
    this.now = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.now = this.datePipe.transform(this.now, 'yyyy-MM-dd');
  }

  ngAfterViewInit(): void {

  }

  openSideBar() {
    this.class = {
        left: 'w-2/12',
        right: 'w-10/12',
        statusbar: true,
    };
  }

  closeSideBar() {
    this.class = {
      left: 'w-5',
      right: 'w-full',
      statusbar: false
    }
  }

  class = {
      left: 'w-2/12',
      right: 'w-10/12',
      statusbar: true,
  };

  searchUser(event: any) {

  }

}
