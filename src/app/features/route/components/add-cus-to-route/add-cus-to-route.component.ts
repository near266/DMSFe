import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerService } from 'src/app/core/services/customer.service';
import { RouteService } from 'src/app/core/services/route.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-add-cus-to-route',
  templateUrl: './add-cus-to-route.component.html',
  styleUrls: ['./add-cus-to-route.component.scss']
})
export class AddCusToRouteComponent implements OnInit {

  constructor(
    private customerSer: CustomerService,
    private routeSer: RouteService,
    @Inject(MAT_DIALOG_DATA) public dataDialog:any,
    private snackbar: SnackbarService,
    public materialDialog: MatDialogRef<AddCusToRouteComponent>
  ) { }

  ngOnInit(): void {
    this.init();
  }
  dataCus:any;
  arrayIdCus:any[] = [];
  successAdd:boolean = false;

  init(){
    let body = {
      keyword: "",
      listRouteId: null,
      page: 1,
      pageSize: 100,
    }
    this.customerSer.search(body).subscribe({
      next: data => {
        this.dataCus = data;
      }
    })
  }

  addCusToRoute(event:any, customerCode:any){
    let statusCheck = event.target.checked;
    if(statusCheck){
      this.arrayIdCus.push({
        customerCode: customerCode
      });

    }else{
      this.arrayIdCus = this.arrayIdCus.filter((item) => item.customerCode !== customerCode);
    }
  }

  submitAddCus(){
    let body;
    if(this.dataDialog.typeRoute == 'update'){
      body = {
        "list": this.arrayIdCus,
        "routeId": this.dataDialog.idRoute
      }
      this.routeSer.Import(body).subscribe({
        next: data => {
          this.snackbar.openSnackbar("Thêm khách hàng thành công !", 3000, "", "right", "bottom", true);
          this.successAdd = true;
        }
      })
    }else{
      body = {
        "list": this.arrayIdCus,
        "routeId": ""
      }
      let listCusTemp:any[] = []
      this.arrayIdCus.forEach((idCus:any) => {
        this.dataCus.data.forEach((item:any) => {
          if(item.customerCode == idCus){
            listCusTemp.push(item)
          }
        })
      })
      this.materialDialog.close(body);
    }
  }

}
