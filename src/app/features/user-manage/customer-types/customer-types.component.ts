import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomerType } from 'src/app/core/model/CustomerType';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AddCustomerTypeComponent } from './add-customer-type/add-customer-type.component';
import { CustomerTypeComponent } from './customer-type/customer-type.component';
import { CustomerTypeService } from './services/customer-type.service';

@Component({
  selector: 'app-customer-types',
  templateUrl: './customer-types.component.html',
  styleUrls: ['./customer-types.component.scss']
})
export class CustomerTypesComponent implements OnInit {

  loading = true;
  sideBarWidth!: string;
  type!: string;
  customerType: CustomerType[] = [];
  totalCount: number;
  keywords: '';
  request: any = {
    keyword: '',
    page: 1,
    pageSize: 30
  };

  dia?: any;
  page: number = 1;
  pageSize: number = 30;
  total: number = 0;
  totalcustomerTypes: number;

  constructor(
    public datepipe: DatePipe,
    private dialog: MatDialog,
    private customerTypeService: CustomerTypeService,
    private snackbar: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.view();
  }

  view(){
    this.customerTypeService.getAllCustomerType(this.request).subscribe(data => {
      if(data){
        this.customerType = data.list;
        this.totalcustomerTypes = data.list.length
        // console.log(data);
      }
    })
  }
  
  AddType(){
    const dialogRef = this.dialog.open(AddCustomerTypeComponent, {
      height: '100vh',
      minWidth: '900px',
      panelClass: 'custom-mat-dialog-container'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result?.event === true){
        this.view();
      }
    });
  }

  open(data: CustomerType | null = null) {
    const dialogRef = this.dialog.open(CustomerTypeComponent, {
        width: '730px',
        height: '90vh',
        data,
    });
      dialogRef.afterClosed().subscribe(result => {
        if(result?.event === true){
          this.view();
        }
      });
  }

  search(request: any){
    this.loading = true;
    if(request) {
      request = ('' + request).trim();
    }
    if(request == null || request == undefined) {
      this.keywords = '';
    } else {
      this.keywords = request;
    }
    this.request.keyword = this.keywords;
    this.customerTypeService.searchCustomerType(this.request).subscribe(
        (data) => {
          this.loading = false;
          if(data) {
            this.customerType = data;
          }
        },
        (error) => {
          this.loading = false;
          this.snackbar.openSnackbar(error, 2000, 'Đóng', 'center', 'bottom', true);
        },
    );
  }
  Select(e: string) {
    if(e.includes('Tất cả') || e.includes('Mở') || e.includes('Khóa')) {
      this.sortByType(e);
      return;
    } else {
      this.sortByField(e);
      return;
    }
  }
  sortByType(key: string) {
    this.request.type = key;
    if(this.request.startedDate && this.request.endDate) {
      this.search('');
    }
  }
  sortByField(key: string) {
    let sort = key.split('-');
    this.request.sortFeild = sort[0];
    this.request.sortValue = sort[1];
    if (this.request.sortValue == 'up') this.request.sortValue = true;
    if (this.request.sortValue == 'down') this.request.sortValue = false;
    this.search(key);
  }

  listMenuObj = [
    {
      title: 'Trạng thái',
      leftTitleIcon: 'fa-filter',
      listMenuPosition: [
        { title: 'Tất cả', leftIcon: '', value: 'all' },
        { title: 'Mở', leftIcon: '', value: 'emp' },
        { title: 'Khóa', leftIcon: '', value: 'emp' },
      ]
    }
  ]

}
