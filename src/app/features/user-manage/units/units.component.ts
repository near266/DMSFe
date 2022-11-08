import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseOrder } from 'src/app/core/model/PurchaseOrder';
import { Unit } from '../../product/models/product';
import { AddnitComponent } from './addnit/addnit.component';
import { DetailUnitComponent } from './detail-unit/detail-unit.component';
import { UnitService } from './services/unit.service';
import { Response } from 'src/app/core/model/Response';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

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
    private dialog: MatDialog,
    private unitService: UnitService,
    private snackbar: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.view();
    this.unitService.totalUnits$.subscribe((total) => (
      this.totalunits = total
    ));
    console.log(this.totalunits)
  }

  view(){
    this.unitService.getAllUnits().subscribe(data => {
      this.unit = data;
      // console.log(this.unit);
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
        this.ngOnInit();
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
          this.ngOnInit();
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
    this.request.page = this.page;
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

}
