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
  unitTreeGroupIdTemp:any = "";

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
  RootInfoRouteDetail :RootInfoRoute;
  groupName:any;


  headerTable = [
    "Mã khách hàng",
    "Tên khách hàng",
    "Loại khách hàng",
    "Nhóm khách hàng",
    "Khu vực",
    "Địa chỉ",
    "Thứ tự VT",
  ]


  formInforRouteUpdate =  this.fb.group({
    id: [''],
    routeCode: [''],
    routeName: [''],
    employeeId: [''],
    unitTreeGroupId: [''],
    routeDate: [''],
    startedDate: [''],
    status: [''],
  });

  EmployeeInGroup:any;
  ngOnInit(): void {
    // console.log(this.idRoute);
    this.getRouteDetail();
    this.dataService.employee.subscribe({
      next: data => {
        if(data !== ""){
          this.formInforRouteUpdate.patchValue({
            // startedDate: new Date(this.formatDate).toISOString(),
            // unitTreeGroupId: this.RootInfoRouteDetail?.unitTreeGroup?.id,
            id: this.RootInfoRouteDetail?.id,
          });
          // console.log("Form Update", this.formInforRouteUpdate.value);

        if(this.typeRoute == "update"){
          // console.log('Update');
          this._routeSer.UpdateRoute(this.formInforRouteUpdate.value).subscribe({
            next: data => {
              // console.log(data);
              this.getRouteDetail();
              this._snackBar.openSnackbar("Cập nhật thành công!", 3000, "", "right", "bottom", true)
            }
          })
        }else{
          // this.formInforRouteUpdate.removeControl('id');
          // this.formInforRouteUpdate.setValue({
          //   unitTreeGroupId: this.unitTreeGroupIdTemp
          // })
          // console.log("Form Add", this.formInforRouteUpdate.value);
          this._routeSer.AddRoute(this.formInforRouteUpdate.value).subscribe({
            next: data => {
              // console.log(data);
              this.getRouteDetail();
              this._snackBar.openSnackbar("Tạo tuyến thành công!", 3000, "", "right", "bottom", true)
            }
          })
        }
        }
      }
    })

  }
  getRouteDetail(){
    this._routeSer.GetRouteById(this.idRoute).subscribe({
      next: data => {
        // console.log(data);
        this.RootInfoRouteDetail = data;
        this.formatDate = data.startedDate.split("T")[0];
        // console.log(this.formatDate);
        this.groupName = data.unitTreeGroup.name;
        this.SearchEmployeeInGroup(data.unitTreeGroup.id)
      }
    })
  };


  getIdName(event:any){
    // console.log("Choose Tree", event);
    this.groupName = event.name;
    this.showGroup = !this.showGroup;
    this.unitTreeGroupIdTemp = event.id
    this.formInforRouteUpdate.patchValue({
      unitTreeGroupId: event.id
    })
    this.SearchEmployeeInGroup(event.id)
  }

  SearchEmployeeInGroup(id:any){
    let body = {
      groupId: id,
      page: 1,
      pagesize: 10000

    }
    // console.log("Get List Employee",body);
    this.customerGroupSer.SearchEmployeeInGroup(body).subscribe({
      next: data => {
        // console.log("List Employee",data);
        this.EmployeeInGroup = data.data;
      }
    })
  }

}
