import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CustomerGroupService } from 'src/app/core/services/customer-group.service';
import { DataService } from 'src/app/core/services/data.service';
import { RouteService } from 'src/app/core/services/route.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AddCusFromExcelComponent } from '../components/add-cus-from-excel/add-cus-from-excel.component';
import { AddCusToRouteComponent } from '../components/add-cus-to-route/add-cus-to-route.component';
import { RootInfoRoute } from '../models/infor-router';
import { RootSearchAllCusInRoute } from '../models/searchAllCusInRoute';

interface BodyAddCusToRouteFromListCus {
  list: List[];
  routeId: string;
}

interface List {
  customerCode: string;
}


@Component({
  selector: 'app-infor-router',
  templateUrl: './infor-router.component.html',
  styleUrls: ['./infor-router.component.scss']
})
export class InforRouterComponent implements OnInit {
  unitTreeGroupIdTemp:any = "";
  unitTreeGroupIdSearch: any;

  constructor(
    private dataService: DataService,
    public datePipe: DatePipe,
    private _routeSer: RouteService,
    private fb: FormBuilder,
    private customerGroupSer: CustomerGroupService,
    private _snackBar: SnackbarService,
    public dialog: MatDialog
  ) { }

  @Input() status: any;
  @Input() idRoute: any;
  @Input() typeRoute:any;
  @Input() typeButton:any;
  @Output() successEdit = new EventEmitter();
  @Output() closeDialogAddRoute = new EventEmitter();


  formatDate:any;
  showGroup:boolean = false;
  RootInfoRouteDetail :RootInfoRoute;
  groupName:any;
  listAllCusInRouteData: RootSearchAllCusInRoute = new RootSearchAllCusInRoute;
  arrayIdCusInRoute:any[] = [];
  keywordSearch:any;
  arrayAllId:any[] = [];
  bodyAddCusToRouteFromListCus:BodyAddCusToRouteFromListCus;
  listCusAfterAddPreview:any[] = [];


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
    status: [null],
  });


  EmployeeInGroup:any;

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

    if(this.typeRoute == 'update'){
      this.getRouteDetail();
      this.searchAllCusInRoute(this.idRoute, "");
    }else{
    }

    // console.log("onChanges", changes['typeButton'].currentValue);
    let typeButtonChange = changes['typeButton'].currentValue;

    if(typeButtonChange == "update"){
      this.formInforRouteUpdate.patchValue({
        id: this.RootInfoRouteDetail?.id,
      });
      // console.log('Form Update',this.formInforRouteUpdate.value);
      this._routeSer.UpdateRoute(this.formInforRouteUpdate.value).subscribe({
        next: data => {
          this.getRouteDetail();
          this._snackBar.openSnackbar("Cập nhật thành công!", 3000, "", "right", "bottom", true);
          this.successEdit.emit(true);
        }
      })
    }
    if(typeButtonChange == "add"){
      this.formInforRouteUpdate.removeControl('id');
      // this.formInforRouteUpdate.setValue({
      //   unitTreeGroupId: this.unitTreeGroupIdTemp
      // })
      // console.log("Form Add", this.formInforRouteUpdate.value);
      this._routeSer.AddRoute(this.formInforRouteUpdate.value).subscribe({
        next: data => {
          // console.log(data);
          this._snackBar.openSnackbar("Tạo tuyến thành công!", 3000, "", "right", "bottom", true);
          this.successEdit.emit(true);
          this.bodyAddCusToRouteFromListCus.routeId = data.id;
          this._routeSer.Import(this.bodyAddCusToRouteFromListCus).subscribe({
            next: data => {
              // console.log(data);
            }
          })

        }
      })
    }
  }


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }

  openAddCusDialog(): void {
    this.closeDialogAddRoute.emit('close')
    const dialogRef = this.dialog.open(AddCusToRouteComponent, {
      width: '50vw',
      height: '80vh',
      data: {
        "idRoute": this.idRoute,
        "typeRoute": this.typeRoute
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.searchAllCusInRoute(this.idRoute, "");
      this.bodyAddCusToRouteFromListCus = result.body;
      this.listCusAfterAddPreview = result.listCusPreview;
    })
  }

  openAddCusExcelDialog(): void {
    this.closeDialogAddRoute.emit('close')
    const dialogExelRef = this.dialog.open(AddCusFromExcelComponent, {
      width: '30vw',
      data: {
        "idRoute": this.idRoute,
        "typeRoute": this.typeRoute
      }
    });
    dialogExelRef.afterClosed().subscribe(result => {
      this.searchAllCusInRoute(this.idRoute, "");
      this.bodyAddCusToRouteFromListCus = result;

    })
  }



  getRouteDetail(){
    this._routeSer.GetRouteById(this.idRoute).subscribe({
      next: data => {
        // console.log("Data Detail",data);
        this.RootInfoRouteDetail = data;
        this.formatDate = data.startedDate?.split("T")[0];
        // console.log(this.formatDate);
        this.unitTreeGroupIdSearch = data.unitTreeGroup.id
        this.groupName = data.unitTreeGroup.name;
        this.formInforRouteUpdate.patchValue({
          unitTreeGroupId: data.unitTreeGroup.id
        })
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

  searchAllCusInRoute(id:any, keyword:any){
    let body = {
      keyword: keyword,
      routeId: id,
      page: 1,
      pagesize: 3000
    }
    this._routeSer.SearchAllCusInRoute(body).subscribe({
      next: (data:RootSearchAllCusInRoute) => {
        this.listAllCusInRouteData = data as RootSearchAllCusInRoute;
      }
    })
  };

  SerchCus(event:any){
    // console.log(event.target.value);
    this.searchAllCusInRoute(this.RootInfoRouteDetail.id, event.target.value);
  }
  changeStatus(event:any){
    // console.log(event.target.value);
    if(event.target.value == 'true'){
      this.formInforRouteUpdate.patchValue({
      status: true,
      })
    }else{
      this.formInforRouteUpdate.patchValue({
        status: false,
        })
    }
  };

  checkAll(event:any){
    let statusCheck = event.target.checked;
    if(statusCheck){
      this.arrayIdCusInRoute = [];
      this.listAllCusInRouteData.data.forEach((currentValue:any) => {
        this.arrayIdCusInRoute.push(currentValue.customer.id)
      });
    }else{
      this.arrayIdCusInRoute = [];
    }
  }


  checkedCusInRoute(event:any, cusId:any){
    let statusCheck = event.target.checked;
    if(statusCheck){
      this.arrayIdCusInRoute.push(cusId);

    }else{
      this.arrayIdCusInRoute = this.arrayIdCusInRoute.filter((item)=>item != cusId);
    }
  }

  deleteCusInRoute(){
    let body = {
      routeId: this.idRoute,
      customerId: this.arrayIdCusInRoute
    }
    this._routeSer.DeleteCusFromRoute(body).subscribe({
      next: (data) => {
        this.searchAllCusInRoute(this.RootInfoRouteDetail.id, this.keywordSearch);
        this._snackBar.openSnackbar("Xoá khách hàng thành công !", 3000, '', 'right', 'bottom', true)
      }
    })
  }

}
