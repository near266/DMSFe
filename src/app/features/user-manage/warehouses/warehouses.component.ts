import { Component, DoCheck, OnInit, OnDestroy, Inject, AfterViewInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { PurchaseOrder } from 'src/app/core/model/PurchaseOrder';
// import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { DataService } from 'src/app/core/services/data.service';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { Title } from '@angular/platform-browser';
import { WarehousesService } from 'src/app/core/services/warehouses.service';
import { LogicService } from './services/logic.service';
import { Warehouse } from './models/warehouse';
import { IBodySearch } from './models/Body';

@Component({
  selector: 'app-warehouses',
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.scss']
})
export class WarehousesComponent implements OnInit {

  isShowSidebarToMargin = true;
  sideBarWidth!: string;
  type!: string;
  warehouses: Warehouse[] = [];
  totalCount: number = 0;
  bodySearch: IBodySearch = {
    keyword: null,
    status: null
  }

  page: number = 1;
  pageSize: number = 30;
  total: number = 0;

  listMenuObj = [
    {
      title: 'Trạng thái',
      leftTitleIcon: 'fa-filter',
      listMenuPosition: [
        { title: 'Tất cả', leftIcon: '', value: 'null' },
        { title: 'Hoạt động', leftIcon: '', value: 'true' },
        { title: 'Không hoạt động', leftIcon: '', value: 'false' },
      ]
    }
  ]

  constructor(
    private title: Title,
    private activatedroute: ActivatedRoute,
    public datepipe: DatePipe,
    public router: Router,
    private logicService: LogicService
    ) { }

  ngOnInit(): void {
    this.title.setTitle('Danh mục kho hàng');
  }

  ngAfterViewInit(): void {
    this.logicService.getAllWareHouse();
    this.logicService.warehouses$.subscribe(data => {
      this.warehouses = data;
    });
    this.logicService.totalCountWarehouse$.subscribe(data => {
      this.totalCount = data;
    })
  }

  ngDoCheck(): void {

  }

  ngOnDestroy(): void {

  }

  Select(event: any) {
    switch(event) {
      case 'null': {
        this.bodySearch.status = null;
        break;
      }
      case 'true': {
        this.bodySearch.status = true;
        break;
      }
      case 'false': {
        this.bodySearch.status = false;
        break;
      }
    }
    this.filter();

  }

  filter() {
    this.logicService.searchWarehouse(this.bodySearch);
  }


}
