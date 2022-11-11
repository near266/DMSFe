import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { RouteService } from 'src/app/core/services/route.service';
import { outputAst } from '@angular/compiler';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
@Component({
  selector: 'app-add-router',
  templateUrl: './add-router.component.html',
  styleUrls: ['./add-router.component.scss']
})
export class AddRouterComponent implements OnInit {

  @Output() alertSuccessEvent = new EventEmitter()


  constructor(
    private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _routeSer: RouteService,
    private _snackSer: SnackbarService
  ) { }
  typeButton:any = "";
  title = 'Thông tin chung'

  ngOnInit(): void {
    console.log(this.data);
  }

  add(e: any) {
    // this.dataService.changeEmployee('add');
    if(this.data.type == 'add'){
      this.typeButton = "add"
    }
    if(this.data.type == 'update'){
      this.typeButton = "update"
    }
  }

  tabList = [
    { title: 'Thông tin chung', leftIcon: 'fa-solid fa-file-invoice' },
    { title: 'Bản đồ', leftIcon: 'fa-solid fa-map-location-dot' },
    { title: 'Lịch sử KH', leftIcon: 'fa-regular fa-hourglass-half' },
  ];

  alertSuccess(event:any){
    this.alertSuccessEvent.emit(true)
  }

  deleteRoute(){
    let body = {
      listId: [
        this.data.id
      ]
    }
    // console.log(body);
    this._routeSer.Delete(body).subscribe({
      next: data => {
        this._snackSer.openSnackbar('Xoá thành công !', 3000, '', 'end', 'bottom', true)
      }
    })

  }


}
