import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.scss']
})
export class DetailUserComponent implements OnInit {

  constructor() { }

  title = 'Thông tin chung'

  ngOnInit(): void {
  }

  tabList = [
    { title: 'Thông tin chung', leftIcon: 'fa-regular fa-file-lines' },
    { title: 'Cấu hình nhân viên', leftIcon: 'fa-solid fa-gear' },
    { title: 'App nhân viên', leftIcon: 'fa-solid fa-gear' },
    { title: 'Menu hiển thị', leftIcon: 'fa-solid fa-list' },
    // { title: 'Chấm thi phòng nhóm', leftIcon: 'fa-solid fa-location-dot' },
  ]

}
