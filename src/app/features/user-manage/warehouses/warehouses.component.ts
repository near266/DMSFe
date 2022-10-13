import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-warehouses',
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.scss']
})
export class WarehousesComponent implements OnInit {

  constructor(private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle('Kho hàng');
  }

  listMenuObj = [
    {
      title: 'Trạng thái',
      leftTitleIcon: 'fa-filter',
      listMenuPosition: [
        { title: 'Tất cả', leftIcon: '', value: 'all' },
        { title: 'Hoạt động', leftIcon: '', value: 'emp' },
        { title: 'Không hoạt động', leftIcon: '', value: 'emp' },
      ]
    }
  ]

  Select(event: any) {

  }

}
