import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomerGroup } from 'src/app/core/model/CustomerGroup';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AddCustomerGroupsComponent } from './add-customer-groups/add-customer-groups.component';
import { CustomerGroupComponent } from './customer-group/customer-group.component';
import { CustomerGroupsService } from './services/customer-groups.service';

@Component({
  selector: 'app-customer-groups',
  templateUrl: './customer-groups.component.html',
  styleUrls: ['./customer-groups.component.scss']
})
export class CustomerGroupsComponent implements OnInit {

  loading = true;
  sideBarWidth!: string;
  type!: string;
  customerGroup: CustomerGroup[] = [];
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
  totalcustomerGroups: number;

  constructor(
    public datepipe: DatePipe,
    private dialog: MatDialog,
    private customerGrouplService: CustomerGroupsService,
    private snackbar: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.view();
  }

  view(){
    this.customerGrouplService.getAllCustomerGroup(this.request).subscribe(data => {
      if(data){
        this.customerGroup = data.list;
        this.totalcustomerGroups = data.list.length
        // console.log(data);
      }
    })
  }
  
  AddGroup(){
    const dialogRef = this.dialog.open(AddCustomerGroupsComponent, {
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

  open(data: CustomerGroup | null = null) {
    const dialogRef = this.dialog.open(CustomerGroupComponent, {
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
    this.customerGrouplService.searchCustomerGroup(this.request).subscribe(
        (data) => {
          this.loading = false;
          if(data) {
            this.customerGroup = data;
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
