import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseOrder } from 'src/app/core/model/PurchaseOrder';
import { Unit } from '../../product/models/product';
import { AddUnitComponent } from './add-unit/add-unit.component';
import { UnitService } from './apis/unit.service';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit {

  sideBarWidth!: string;
  type!: string;
  listOrder: PurchaseOrder[] = [];
  unit: Unit[] = [];
  totalCount: number;

  dia?: any;
  page: number = 1;
  pageSize: number = 30;
  total: number = 0;

  constructor(
    private dialog: MatDialog,
    private unitService: UnitService
  ) { }

  ngOnInit(): void {
    this.unitService.getAllUnits().subscribe(data => {
      this.unit = data;
      // console.log(this.unit);
    })
  }

  AddUnit() {
    this.dia = this.dialog.open(AddUnitComponent, {
        height: '100vh',
        minWidth: '900px',
        panelClass: 'custom-mat-dialog-container'
    });
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
