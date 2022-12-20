import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ConfirmDialogService } from 'src/app/core/shared/services/confirm-dialog.service';
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
  selectedIds: string[] = [];
  major: Major[] = [];
  totalCount: number;
  keywords: '';
  request: any = {
    keyword: '',
    page: 1,
    pageSize: 30
  };

  res: any;
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
    private confirmService: ConfirmDialogService,
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
    if(e.includes('Tất cả')) {
      this.request.keyword = this.keywords;
      this.request.status = null;
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
      return;
    } else if (e.includes('Hoạt động')) {
      this.request.keyword = this.keywords;
      this.request.status = true;
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
      return;
    } else if (e.includes('Khóa')) {
      this.request.keyword = this.keywords;
      this.request.status = false;
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
      return;
    }
  }

  // sortByType(key: string) {
  //   this.request.type = key;
  //   if(this.request.startedDate && this.request.endDate) {
  //     this.search('');
  //   }
  // }
  // sortByField(key: string) {
  //   let sort = key.split('-');
  //   this.request.sortFeild = sort[0];
  //   this.request.sortValue = sort[1];
  //   if (this.request.sortValue == 'up') this.request.sortValue = true;
  //   if (this.request.sortValue == 'down') this.request.sortValue = false;
  //   this.search(key);
  // }

  filter() {
    this.loading = true;
    this.majorService.getAllMajor(this.request).subscribe(
      (data) => {
        if (data) {
          this.res = data;
          this.major = [];
          this.totalmajors = this.res.length;
          this.major = data;
          this.loading = false;
        } else {
          this.loading = false;
          this.snackbar.openSnackbar('Không tìm thấy danh sách nhà cung cấp', 2000, 'Đóng', 'center', 'bottom', false);
        }
      },
      (error) => {
        this.loading = false;
        this.snackbar.openSnackbar('Không tìm thấy danh sách nhà cung cấp', 2000, 'Đóng', 'center', 'bottom', false);
      },
    );
  }

  change(id: string) {
    if (this.selectedIds.indexOf(id) < 0) {
      this.selectedIds.push(id);
    } else {
      this.selectedIds.splice(this.selectedIds.indexOf(id), 1);
    }
  }

  DeleteMajors() {
    this.confirmService.openDialog({ message: 'Bạn có chắc chắn muốn xóa những nhà cung cấp này?', confirm: 'Xác nhận', cancel: 'Hủy' }).subscribe(data => {
      if (data) {
        this.deleteMajorsByIds(this.selectedIds);
      }
    });
  }

  deleteMajorsByIds(selectedIds: string[]) {
    const body = {
      id: selectedIds
    };
    let sub = this.majorService.del(body).subscribe(data => {
      if (data && data.message > 0) {
        this.snackbar.openSnackbar('Xóa nhà cung cấp thành công', 2000, 'Đóng', 'center', 'bottom', true);
        this.filter();
      } else {
        this.snackbar.openSnackbar('Xóa nhà cung cấp thất bại', 2000, 'Đóng', 'center', 'bottom', false);
      }
      sub.unsubscribe();
    }, (error) => {
      this.snackbar.openSnackbar('Xóa nhà cung cấp thất bại', 2000, 'Đóng', 'center', 'bottom', false);
      sub.unsubscribe();
    });
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
