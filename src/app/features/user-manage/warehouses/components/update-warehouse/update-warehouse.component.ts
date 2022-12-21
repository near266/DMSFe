import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Warehouse } from '../../models/warehouse';
import { LogicService } from '../../services/logic.service';

@Component({
  selector: 'app-update-warehouse',
  templateUrl: './update-warehouse.component.html',
  styleUrls: ['./update-warehouse.component.scss']
})
export class UpdateWarehouseComponent implements OnInit, AfterViewInit {

  title = 'Thông tin chung';
  submit: boolean;
  warehouse: Warehouse = {
      id: '',
      warehouseName: '',
      warehouseCode: '',
      warehouseType: '',
      status: false,
      description: '',
      responsibleAccountant: '',
      createdBy: '',
      createdDate: '',
      lastModifiedBy: '',
      lastModifiedDate: ''
  };

  tabList = [
    { title: 'Thông tin chung', leftIcon: 'fa-regular fa-file-lines' },
  ]

  constructor(
    public dialogRef: MatDialogRef<UpdateWarehouseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private logic: LogicService
  ) { }

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
        this.logic.detailWarehouse$.subscribe( warehouse => {
            this.warehouse = warehouse;
        });
    });
  }

  ngOnInit(): void {
    this.submit = false;
  }

  save() {
    this.submit = true;
  }

  signal(event: boolean) {
    if(event == true) {
        this.dialogRef.close({event: true});
        return;
    }
    Promise.resolve().then( () => {
        this.submit = event;

    });
  }

  DeleteWareHouse() {

  }

}
