import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PurchaseOrderList } from 'src/app/core/data/PurchaseOrderList';
import { PurchaseOrder } from 'src/app/core/model/PurchaseOrder';

@Component({
  selector: 'app-order-sale-mgm',
  templateUrl: './order-sale-mgm.component.html',
  styleUrls: ['./order-sale-mgm.component.scss']
})
export class OrderSaleMgmComponent implements OnInit {
  isShowSidebarToMargin = true;
  sideBarWidth!: string;
  type!: string;
  listOrder: PurchaseOrder[] = PurchaseOrderList;
  constructor(private activatedroute: ActivatedRoute, public datepipe: DatePipe) { }

  ngOnInit(): void { }

  ngDoCheck(): void {
    let table = document.getElementById('table');
    table?.classList.add('width-vw-260');
    if (this.isShowSidebarToMargin) {
      table?.classList.remove('width-vw-60');
      table?.classList.add('width-vw-260');
    } else {
      table?.classList.add('width-vw-60');
      table?.classList.remove('width-vw-260');
    }
  }

  ngOnDestroy(): void {
    // console.log('Đã hủy')
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
