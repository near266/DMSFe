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



  startIndex: number;
  endIndex: number;
  page: number = 1;
  pageSize: number = 30;
  total: number = 0;

  dataCus:any;
  arrayIdCus:any[] = [];
  successAdd:boolean = false;

  ngOnInit(): void {
    this.init();
  }

  init(){
    let body = {
      keyword: "",
      listRouteId: null,
      page: this.page,
      pageSize: this.pageSize
    }
    this.customerSer.search(body).subscribe({
      next: data => {
        this.dataCus = data;
        this.total = data.totalCount;
      }
    });
    this.setIndexToFirstPage();
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
    if(this.dataDialog.typeRoute == 'update'){          // update case
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
    }else{                              // add case
      let listCusTemp:any[] = []
      // body = {
      //   "list": this.arrayIdCus,
      //   "routeId": ""
      // }
      this.arrayIdCus.forEach((idCus:any) => {
        this.dataCus.data.forEach((item:any) => {
          if(item.customerCode == idCus.customerCode){
            listCusTemp.push(item)
          }
        })
      })
      let res = {
        body: {
          "list": this.arrayIdCus,
          "routeId": ""
        },
        listCusPreview: listCusTemp
      }
      this.materialDialog.close(res);
    }
  };

  setIndexToFirstPage() {
    this.startIndex = 1;
    this.endIndex = Math.min(this.startIndex + this.pageSize, this.total);
  }

  setIndexToSecondPageToDiffrentFirstPage(event: any) {
    this.startIndex = (event - 1) * this.pageSize + event;
    this.endIndex = Math.min(this.startIndex + this.pageSize, this.total);
  }

  onTableDataChange(event: any) {
    if (event === 1) {
        this.setIndexToFirstPage();
    } else {
        this.setIndexToSecondPageToDiffrentFirstPage(event);
    }
    this.page = event;
    this.init();
  }
  onTableSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    // this.fetchPosts();
  }

}
