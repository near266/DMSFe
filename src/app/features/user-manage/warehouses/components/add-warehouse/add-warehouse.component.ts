import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-warehouse',
  templateUrl: './add-warehouse.component.html',
  styleUrls: ['./add-warehouse.component.scss']
})
export class AddWarehouseComponent implements OnInit {

  title = 'Thông tin chung';

  tabList = [
    { title: 'Thông tin chung', leftIcon: 'fa-regular fa-file-lines' },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
