import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { DataService } from 'src/app/core/services/data.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { RouteService } from 'src/app/core/services/route.service';
import { outputAst } from '@angular/compiler';
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
    { title: 'Thông tin chung', leftIcon: 'fa-regular fa-file-lines' },
    { title: 'Bản đồ', leftIcon: 'fa-solid fa-gear' },
    { title: 'Lịch sử KH', leftIcon: 'fa-solid fa-gear' },
  ];

  alertSuccess(event:any){
    this.alertSuccessEvent.emit(true)
  }

}
