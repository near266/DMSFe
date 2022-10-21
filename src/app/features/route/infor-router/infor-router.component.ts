import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';
import { RouteService } from 'src/app/core/services/route.service';
import { RootInfoRoute } from '../models/infor-router';

@Component({
  selector: 'app-infor-router',
  templateUrl: './infor-router.component.html',
  styleUrls: ['./infor-router.component.scss']
})
export class InforRouterComponent implements OnInit {

  constructor(
    private dataService: DataService,
    public datePipe: DatePipe,
    private _routeSer: RouteService,
    private fb: FormBuilder,
  ) { }

  @Input() status: any;
  @Input() idRoute: any;

  showGroup:boolean = false;
  RootInfoRouteDetail :RootInfoRoute =  new RootInfoRoute;

  formInforRoute =  this.fb.group({
    routeCode: [''],
    routeName: [''],
    employeeId: [''],
    employee: [''],
    unitTreeGroupId: [''],
    unitTreeGroup: [''],
    routeDate: [''],
    startedDate: [''],
    status: true,
    routeCustomer: [''],
    id: [''],
    createdBy: [''],
    createdDate: [''],
    lastModifiedBy: [''],
    lastModifiedDate: ['']
  })
  ngOnInit(): void {
    console.log(this.idRoute);
    this.getRouteDetail();

  }
  getRouteDetail(){
    this._routeSer.GetRouteById(this.idRoute).subscribe({
      next: data => {
        console.log(data);
        this.RootInfoRouteDetail = data as RootInfoRoute
      }
    })
  }

}
