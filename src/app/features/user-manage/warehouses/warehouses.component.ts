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
import { IBodySearch } from './models/BodySearch';
import { MatDialog } from '@angular/material/dialog';
import { AddWarehouseComponent } from './components/add-warehouse/add-warehouse.component';
import { UpdateWarehouseComponent } from './components/update-warehouse/update-warehouse.component';
import { ConfirmDialogService } from 'src/app/core/shared/services/confirm-dialog.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { TypeExport } from '../common/common.service';

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
  listSelectedId: string[] = [];
  bodySearch: IBodySearch = {
    keyword: null,
    status: null
  }

  loading: boolean = false;

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
    private logicService: LogicService,
    private dialog: MatDialog,
    private confirmService: ConfirmDialogService,
    private readonly warehouseSvc: WarehousesService,
    private snackbar: SnackbarService,
    
    
    ) { }

  ngOnInit(): void {
    this.title.setTitle('Danh mục kho hàng');
    this.logicService.loading$.subscribe(data => {
        Promise.resolve().then(() => {
            this.loading = data;
        })
    })
  }

  ngAfterViewInit(): void {
    this.init();
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

  init() {
    this.logicService.getAllWareHouse();
    this.logicService.warehouses$.subscribe(data => {
      this.warehouses = data;
    });
    this.logicService.totalCountWarehouse$.subscribe(data => {
      this.totalCount = data;
    });
  }

  filter() {
    this.logicService.searchWarehouse(this.bodySearch);
  }

  change(id: string) {
    if(this.listSelectedId.indexOf(id) < 0) {
      this.listSelectedId.push(id);
    } else {
      this.listSelectedId.splice(this.listSelectedId.indexOf(id), 1);
    }
  }

  AddWareHouse() {
    let sub = this.dialog.open(AddWarehouseComponent, {
      height: '100vh',
      minWidth: '900px',
      panelClass: 'custom-mat-dialog-container'
    });
    sub.afterClosed().subscribe( event => {
        if(event) {
            this.logicService.getAllWareHouse();
        }
    });
  }

  DetailWareHouse(warehouse: Warehouse) {
    let sub = this.dialog.open(UpdateWarehouseComponent, {
      data: warehouse.id,
      height: '100vh',
      minWidth: '900px',
      panelClass: 'custom-mat-dialog-container'
    });
    sub.afterClosed().subscribe( event => {
        if(event) {
            this.logicService.getAllWareHouse();
        }
    });
  }

  DeleteWareHouse() {
    this.confirmService.openDialog({message: 'Bạn có chắc chắn muốn xóa những kho hàng này?',confirm: 'Xác nhận',cancel: 'Hủy'}).subscribe( data => {
      if(data) {
        this.logicService.deleteWareHouse(this.listSelectedId);
      }
    });
  }
  
  
  Export(type: number, data$: any, message: string) {
    this.confirmService.open(message, ['Có', 'Không']).subscribe((d) => {
        if (d === 'Có') {
            this.loading = true;
            this.warehouseSvc.export(type, data$).subscribe(
                (data) => {
                    const blob = new Blob([data], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    });
                    const url = window.URL.createObjectURL(blob);
                    window.open(url);
                    this.loading = false;
                },
                (err) => {
                    this.snackbar.failureSnackBar();
                },
            );
        }
    });
}
handleEmitMessage(e: any) {
  switch (e) {
      case 'Được chọn': {
          if (this.listSelectedId.length) {
              this.Export(
                  TypeExport.Selected,
                  this.listSelectedId,
                  `Bạn có muốn xuất ${this.listSelectedId.length} bản ghi không?`,
              );
          }
          break;
      }
      case 'Điều kiện tìm': {
          if (this.totalCount) {
              this.Export(
                  TypeExport.Filter,
                  this.bodySearch,
                  `Bạn có muốn xuất ${this.totalCount} bản ghi không?`,
              );
          }
          break;
      }
  }
}
  exportMenu = {
    title: 'Xuất dữ liệu',
    leftTitleIcon: 'fa-file-export',
    listMenuPosition: [
        { title: 'Được chọn', leftIcon: 'fa-circle-check', value: 'Được chọn' },
        { title: 'Điều kiện tìm', leftIcon: 'fa-filter', value: 'Điều kiện tìm' },
    ],
};
}
