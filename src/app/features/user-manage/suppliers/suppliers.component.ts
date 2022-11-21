import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Supplier } from '../../product/models/product';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';
import { SupplierService } from './services/supplier.service';
import { SupplierComponent } from './supplier/supplier.component';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {

  loading = true;
  sideBarWidth!: string;
  type!: string;
  supplier: Supplier[] = [];
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
  totalsuppliers: number;

  constructor(
    public datepipe: DatePipe,
    private dialog: MatDialog,
    private supplierService: SupplierService,
    private snackbar: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.view();
  }
  
  view(){
    this.supplierService.getAllSupplier(this.request).subscribe(data => {
      // console.log(data);
      if(data){
        this.supplier = data;
        this.totalsuppliers = data.length
      }
    })
  }
  
  Add(){
    const dialogRef = this.dialog.open(AddSupplierComponent, {
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

  open(data: Supplier | null = null) {
    const dialogRef = this.dialog.open(SupplierComponent, {
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
    this.supplierService.searchSupplier(this.request).subscribe(
        (data) => {
          this.loading = false;
          if(data) {
            this.supplier = data;
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
