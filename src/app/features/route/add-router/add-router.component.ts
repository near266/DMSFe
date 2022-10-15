import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-add-router',
  templateUrl: './add-router.component.html',
  styleUrls: ['./add-router.component.scss']
})
export class AddRouterComponent implements OnInit {

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
    { title: 'Bản đồ', leftIcon: 'fa-solid fa-gear' },
    { title: 'Lịch sử KH', leftIcon: 'fa-solid fa-gear' },
  ]

}
