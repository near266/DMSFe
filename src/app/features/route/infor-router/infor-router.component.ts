import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CustomerGroupService } from 'src/app/core/services/customer-group.service';
import { DataService } from 'src/app/core/services/data.service';
import { RouteService } from 'src/app/core/services/route.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
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
    private customerGroupSer: CustomerGroupService,
    private _snackBar: SnackbarService
  ) { }

  @Input() status: any;
  @Input() idRoute: any;
  @Input() typeRoute:any;
  formatDate:any;
  showGroup:boolean = false;
  RootInfoRouteDetail :RootInfoRoute =  new RootInfoRoute;
  groupName:any;
  formInforRouteUpdate =  this.fb.group({
    id: [''],
    routeCode: [''],
    routeName: [''],
    employeeId: [''],
    unitTreeGroupId: [''],
    routeDate: [''],
    startedDate: [''],
    status: true,
    // employee: [''],
    // unitTreeGroup: [''],
    // routeCustomer: [''],
    // createdBy: [''],
    // createdDate: [''],
    // lastModifiedBy: [null],
    // lastModifiedDate: [null]
  });

  EmployeeInGroup:any;
  ngOnInit(): void {
    console.log(this.idRoute);
    this.getRouteDetail();
    this.dataService.employee.subscribe({
      next: data => {
        console.log(data);
        this.formInforRouteUpdate.patchValue({
          // startedDate: new Date(this.formatDate).toISOString(),
          id: this.RootInfoRouteDetail.id,
          unitTreeGroupId: this.RootInfoRouteDetail.unitTreeGroupId,
          employeeId: this.RootInfoRouteDetail.employeeId,
        });
        console.log("Form Update", this.formInforRouteUpdate.value);
        if(this.typeRoute === "update"){
          console.log('Update');
          this._routeSer.UpdateRoute(this.formInforRouteUpdate.value).subscribe({
            next: data => {
              console.log(data);
              this.getRouteDetail();
              // this._snackBar.openSnackbar("Update thành công!", 3000, "", "right", "bottom", true)
            }
          })
        }else{
          console.log("Add");
          console.log("Form Add", this.formInforRouteUpdate.value);
          this._routeSer.AddRoute(this.formInforRouteUpdate.value).subscribe({
            next: data => {
              console.log(data);
              this.getRouteDetail();
            }
          })
        }


      }
    })

  }
  getRouteDetail(){
    this._routeSer.GetRouteById(this.idRoute).subscribe({
      next: data => {
        console.log(data);
        this.RootInfoRouteDetail = data as RootInfoRoute;
        this.formatDate = data.startedDate.split("T")[0];
        console.log(this.formatDate);
        this.groupName = data.unitTreeGroup.name;
        this.SearchEmployeeInGroup(data.unitTreeGroup.id)
      }
    })
  };
  getIdName(event:any){
    console.log(event);
    this.groupName = event.name;
    this.showGroup = !this.showGroup;
    this.SearchEmployeeInGroup(event.id)
  }

  SearchEmployeeInGroup(id:any){
    this.customerGroupSer.SearchEmployeeInGroup(id, "1", "10000").subscribe({
      next: data => {
        console.log(data);
        this.EmployeeInGroup = data.data;
      }
    })
  }

}
