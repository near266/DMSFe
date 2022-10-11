import { Component, DoCheck, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PurchaseOrderList } from 'src/app/core/data/PurchaseOrderList';
import { PurchaseOrder } from 'src/app/core/model/PurchaseOrder';
// import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, DoCheck {
  isShowSidebarToMargin = true;
  sideBarWidth!: string;
  type!: string;
  listOrder: PurchaseOrder[] = PurchaseOrderList;

  constructor(private activatedroute: ActivatedRoute, public datepipe: DatePipe) { }

  ngOnInit(): void {
  }
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
