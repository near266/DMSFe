import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Major } from '../../product/models/product';
import { AddMajorComponent } from './add-major/add-major.component';
import { MajorComponent } from './major/major.component';
import { MajorService } from './services/major.service';

@Component({
  selector: 'app-majors',
  templateUrl: './majors.component.html',
  styleUrls: ['./majors.component.scss']
})
export class MajorsComponent implements OnInit {

  loading = true;
  sideBarWidth!: string;
  type!: string;
  major: Major[] = [];
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
  totalmajors: number;

  constructor(
    public datepipe: DatePipe,
    private dialog: MatDialog,
    private majorService: MajorService,
    private snackbar: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.view();
  }

  view(){
    this.majorService.getAllMajor(this.request).subscribe(data => {
      if(data){
        this.major = data;
        this.totalmajors = data.length
        // console.log(data);
      }
    })
  }

  AddMajor(){
    const dialogRef = this.dialog.open(AddMajorComponent, {
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

  open(data: Major | null = null) {
    const dialogRef = this.dialog.open(MajorComponent, {
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
    this.majorService.searchMajor(this.request).subscribe(
        (data) => {
          this.loading = false;
          if(data) {
            this.major = data;
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
