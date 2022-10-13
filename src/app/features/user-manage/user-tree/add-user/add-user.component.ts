import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  constructor(
    private dataService: DataService
  ) { }

  title = 'Thông tin chung'

  ngOnInit(): void {
  }

  add(e: any) {
    this.dataService.changeEmployee('add')
  }

  tabList = [
    { title: 'Thông tin chung', leftIcon: 'fa-regular fa-file-lines' },
    { title: 'Cấu hình nhân viên', leftIcon: 'fa-solid fa-gear' },
    { title: 'App nhân viên', leftIcon: 'fa-solid fa-gear' },
    { title: 'Menu hiển thị', leftIcon: 'fa-solid fa-list' },
    // { title: 'Chấm thi phòng nhóm', leftIcon: 'fa-solid fa-location-dot' },
  ]

}
