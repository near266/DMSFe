import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Config } from 'src/app/core/model/Config';

@Component({
  selector: 'app-timekeeping',
  templateUrl: './timekeeping.component.html',
  styleUrls: ['./timekeeping.component.scss']
})
export class TimekeepingComponent implements OnInit, AfterViewInit {

  now: any;
  loading = true;
  hasEmployee = false;

  positionMenu: Config = {
    icon: '<i class="fa-solid fa-filter"></i>',
    title: 'Lọc theo chức danh',
    menuChildrens: ['Tất cả', 'Nhân viên', 'Kế toán', 'Giám sát', 'Chủ sở hữu'],
  };

  selectPosition(event: any) {

  }

  constructor(
    private datePipe: DatePipe,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Báo cáo chấm công tháng');
    this.now = Date.now();
    this.now = this.datePipe.transform(this.now, 'yyyy-MM-dd');
    console.log(this.now);

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
