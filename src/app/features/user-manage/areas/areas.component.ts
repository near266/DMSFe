import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Area } from 'src/app/core/model/Area';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ConfirmDialogService } from 'src/app/core/shared/services/confirm-dialog.service';
import { AddAreaComponent } from './add-area/add-area.component';
import { AreaComponent } from './area/area.component';
import { AreaService } from './services/area.service';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss']
})
export class AreasComponent implements OnInit {

  loading = true;
  sideBarWidth!: string;
  type!: string;
  selectedIds: string[] = [];
  area: Area[] = [];
  totalCount: number;
  keywords: '';
  request: any = {
    keyword: '',
    status: null,
    page: 1,
    pageSize: 30
  };

  res: any;
  dia?: any;
  page: number = 1;
  pageSize: number = 30;
  total: number = 0;
  totalareas: number;

  constructor(
    public datepipe: DatePipe,
    private dialog: MatDialog,
    private areaService: AreaService,
    private snackbar: SnackbarService,
    private confirmService: ConfirmDialogService,
  ) { }

  ngOnInit(): void {

    this.view();
  }

  view(){
    this.areaService.getAllArea(this.request).subscribe(data => {
      if(data){
        this.area = data.list;
        this.totalareas = data.list.length
        console.log(data);
      }
    })
  }
  
  AddArea(){
    const dialogRef = this.dialog.open(AddAreaComponent, {
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

  open(data: Area | null = null) {
    const dialogRef = this.dialog.open(AreaComponent, {
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
    this.areaService.searchArea(this.request).subscribe(
        (data) => {
          this.loading = false;
          if(data) {
            this.area = data.list;
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
      this.areaService.searchArea(this.request).subscribe(
        (data) => {
          this.loading = false;
          if(data) {
            this.area = data.list;
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
      this.areaService.searchArea(this.request).subscribe(
        (data) => {
          this.loading = false;
          if(data) {
            this.area = data.list;
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
      this.areaService.searchArea(this.request).subscribe(
        (data) => {
          this.loading = false;
          if(data) {
            this.area = data.list;
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
    this.areaService.getAllArea(this.request).subscribe(
      (data) => {
        if (data) {
          this.res = data.list;
          this.area = [];
          this.totalareas = this.res.length;
          this.area = data.list;
          this.loading = false;
        } else {
          this.loading = false;
          this.snackbar.openSnackbar('Không tìm thấy danh sách khu vực', 2000, 'Đóng', 'center', 'bottom', false);
        }
      },
      (error) => {
        this.loading = false;
        this.snackbar.openSnackbar('Không tìm thấy danh sách khu vực', 2000, 'Đóng', 'center', 'bottom', false);
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

  DeleteAreas() {
    this.confirmService.openDialog({ message: 'Bạn có chắc chắn muốn xóa những khu vực này?', confirm: 'Xác nhận', cancel: 'Hủy' }).subscribe(data => {
      if (data) {
        this.deleteAreasByIds(this.selectedIds);
      }
    });
  }

  deleteAreasByIds(selectedIds: string[]) {
    const body = {
      listId: selectedIds
    };
    // console.log(body);
    
    let sub = this.areaService.del(body).subscribe(data => {
      if (data && data.message > 0) {
        this.snackbar.openSnackbar('Xóa khu vực thành công', 2000, 'Đóng', 'center', 'bottom', true);
        this.filter();
      } else {
        this.snackbar.openSnackbar('Xóa khu vực thất bại', 2000, 'Đóng', 'center', 'bottom', false);
      }
      sub.unsubscribe();
    }, (error) => {
      this.snackbar.openSnackbar('Xóa khu vực thất bại', 2000, 'Đóng', 'center', 'bottom', false);
      sub.unsubscribe();
    });
  }

  listMenuObj = [
    {
      title: 'Trạng thái',
      leftTitleIcon: 'fa-filter',
      listMenuPosition: [
        { title: 'Tất cả', leftIcon: '', value: 'Tất cả' },
        { title: 'Hoạt động', leftIcon: '', value: 'Hoạt động' },
        { title: 'Khóa', leftIcon: '', value: 'Khóa' },
      ]
    }
  ]

}
