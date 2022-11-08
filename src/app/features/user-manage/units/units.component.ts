import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseOrder } from 'src/app/core/model/PurchaseOrder';
import { Unit } from '../../product/models/product';
import { AddnitComponent } from './addnit/addnit.component';
import { DetailUnitComponent } from './detail-unit/detail-unit.component';
import { UnitService } from './services/unit.service';
import { Response } from 'src/app/core/model/Response';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit {

  loading = true;
  sideBarWidth!: string;
  type!: string;
  listOrder: PurchaseOrder[] = [];
  unit: Unit[] = [];
  totalCount: number;
  keywords: '';
  request: any = {
    keyword: '',
    page: 1,
    pageSize: 30
  };

  dia?: any;
  page: number = 1;
  pageSize: number = 30;
  total: number = 0;
  totalunits: number;

  constructor(
    public datepipe: DatePipe,
    private dialog: MatDialog,
    private unitService: UnitService,
    private snackbar: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.view();
  }

  view(){
    this.unitService.getAllUnits().subscribe(data => {
      // console.log(this.unit);
      if(data){
        this.unit = data;
        this.totalunits = data.length
      }
    })
  }

  AddUnit() {
    const dialogRef = this.dialog.open(AddnitComponent, {
        height: '100vh',
        minWidth: '900px',
        panelClass: 'custom-mat-dialog-container'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result?.event === true){
        this.view();
      }
    });
  }

  open(data: Unit | null = null) {
    const dialogRef = this.dialog.open(DetailUnitComponent, {
        width: '730px',
        height: '90vh',
        data,
    });
      dialogRef.afterClosed().subscribe(result => {
        if(result?.event === true){
          this.view();
        }
      });
  }

  search(request: any) {
    this.loading = true;
    if(request) {
      request = ('' + request).trim();
    }
    if(request == null || request == undefined) {
      this.keywords = '';
    } else {
      this.keywords = request;
    }
    this.request.keyword = this.keywords;
    this.unitService.searchUnit(this.request).subscribe(
        (data) => {
          this.loading = false;
          if(data) {
            this.unit = data;
          }
        },
        (error) => {
          this.loading = false;
          this.snackbar.openSnackbar(error, 2000, 'Đóng', 'center', 'bottom', true);
        },
    );
  }

  Select(e: string) {
    if(e.includes('Tất cả') || e.includes('Hoạt động') || e.includes('Khóa')) {
      this.sortByType(e);
      return;
    } else {
      this.sortByField(e);
      return;
    }
  }
  sortByType(key: string) {
    this.request.type = key;
    if(this.request.startedDate && this.request.endDate) {
      this.search('');
    }
  }

  sortByField(key: string) {
    let sort = key.split('-');
    this.request.sortFeild = sort[0];
    this.request.sortValue = sort[1];
    if (this.request.sortValue == 'up') this.request.sortValue = true;
    if (this.request.sortValue == 'down') this.request.sortValue = false;
    this.search(key);
  }

  listMenuObj = [
    {
      title: 'Trạng thái',
      leftTitleIcon: 'fa-filter',
      listMenuPosition: [
        { title: 'Tất cả', leftIcon: '', value: 'all' },
        { title: 'Hoạt động', leftIcon: '', value: 'emp' },
        { title: 'Khóa', leftIcon: '', value: 'emp' },
      ]
    }
  ]

}
