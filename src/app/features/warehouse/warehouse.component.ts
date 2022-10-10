import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {
  isShowSidebarToMargin = true;

  constructor() { }

  ngOnInit(): void {
  }

  isShowSidebar(e: any) {
    this.isShowSidebarToMargin = e;
    let table = document.getElementById('table');
    if (this.isShowSidebarToMargin) {
        table?.classList.remove('width-vw-60');
        table?.classList.add('width-vw-260');
    } else {
        table?.classList.add('width-vw-60');
        table?.classList.remove('width-vw-260');
    }
}

}
