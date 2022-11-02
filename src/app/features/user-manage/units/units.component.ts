import { Component, OnInit } from '@angular/core';
import { PurchaseOrder } from 'src/app/core/model/PurchaseOrder';
import { Unit } from '../../product/models/product';
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

  page: number = 1;
  pageSize: number = 30;
  total: number = 0;

  constructor(private unitService: UnitService) { }

  ngOnInit(): void {
    this.unitService.getAllUnits().subscribe(data => {
      this.unit = data;
      // console.log(this.unit);
    })
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
