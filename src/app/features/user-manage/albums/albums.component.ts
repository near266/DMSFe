import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Album } from 'src/app/core/model/Album';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ConfirmDialogService } from 'src/app/core/shared/services/confirm-dialog.service';
import { AddAlbumComponent } from './add-album/add-album.component';
import { AlbumComponent } from './album/album.component';
import { AlbumService } from './services/album.service';
import { TypeExport } from '../common/common.service';

import { FieldsDialogComponent } from '../../customers/fields-dialog/fields-dialog.component';
export interface IBody {
  filter?: any;
  listId?: any[] | null;
  type?: any;
  listProperties?: any[] | null;
}
@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss']
})
export class AlbumsComponent implements OnInit {

  loading = true;
  sideBarWidth!: string;
  type!: string;
  selectedIds: string[] = [];
  album: Album[] = [];
  totalCount: number;
  keywords: '';
  keysearch:'';
  request: any = {
    keyword: '',
    status: null,
    page: 1,
    pageSize: 30
  };
  selectedList: string[] = [];
  isLoading: boolean = false;
  totalAlbumTypes: number;
  

  res: any;
  dia?: any;
  page: number = 1;
  pageSize: number = 30;
  total: number = 0;
  totalalbums: number;

  constructor(
    public datepipe: DatePipe,
    private dialog: MatDialog,
    private albumService: AlbumService,
    private snackbar: SnackbarService,
    private confirmService: ConfirmDialogService,
  ) { }

  ngOnInit(): void {
    this.view();
  }

  view(){
    this.albumService.getAllAlbum(this.request).subscribe(data => {
      if(data){
        this.album = data;
        this.totalalbums = data.length
      }
    })
  }
  
  AddAlbum(){
    const dialogRef = this.dialog.open(AddAlbumComponent, {
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

  open(data: Album | null = null) {
    const dialogRef = this.dialog.open(AlbumComponent, {
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
      this.keysearch='';
    } else {
    if(this.keysearch !=null){
      this.keysearch=request;
    }else{

      this.keywords = request;
    }
      
    }
    this.request.keyword = this.keywords;
    this.albumService.searchAlbum(this.request).subscribe(
        (data) => {
          this.loading = false;
          if(data) {
            this.album = data;
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
      this.albumService.searchAlbum(this.request).subscribe(
        (data) => {
          this.loading = false;
          if(data) {
            this.album = data;
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
      this.albumService.searchAlbum(this.request).subscribe(
        (data) => {
          this.loading = false;
          if(data) {
            this.album = data;
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
      this.albumService.searchAlbum(this.request).subscribe(
        (data) => {
          this.loading = false;
          if(data) {
            this.album = data;
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
    this.albumService.getAllAlbum(this.request).subscribe(
      (data) => {
        if (data) {
          this.res = data;
          this.album = [];
          this.totalalbums = this.res.length;
          this.album = data;
          this.loading = false;
        } else {
          this.loading = false;
          this.snackbar.openSnackbar('Không tìm thấy danh sách album ảnh', 2000, 'Đóng', 'center', 'bottom', false);
        }
      },
      (error) => {
        this.loading = false;
        this.snackbar.openSnackbar('Không tìm thấy danh sách album ảnh', 2000, 'Đóng', 'center', 'bottom', false);
      },
    );
  }

  change(id: string) {
    console.log(id);
    
    if (this.selectedIds.indexOf(id) < 0) {
      this.selectedIds.push(id);
    } else {
      this.selectedIds.splice(this.selectedIds.indexOf(id), 1);
    }
  }

  DeleteAlbums() {
    this.confirmService.openDialog({ message: 'Bạn có chắc chắn muốn xóa những album ảnh này?', confirm: 'Xác nhận', cancel: 'Hủy' }).subscribe(data => {
      if (data) {
        this.deleteAlbumsByIds(this.selectedIds);
      }
    });
  }

  deleteAlbumsByIds(selectedIds: string[]) {
    const body = {
      listId: selectedIds
    };
    // console.log(body);
    
    let sub = this.albumService.del(body).subscribe(data => {
      if (data && data.message > 0) {
        this.snackbar.openSnackbar('Xóa album ảnh thành công', 2000, 'Đóng', 'center', 'bottom', true);
        this.filter();
      } else {
        this.snackbar.openSnackbar('Xóa album ảnh thất bại', 2000, 'Đóng', 'center', 'bottom', false);
      }
      sub.unsubscribe();
    }, (error) => {
      this.snackbar.openSnackbar('Xóa album ảnh thất bại', 2000, 'Đóng', 'center', 'bottom', false);
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

  Export(type: number, data$: any, message: string) {
    this.confirmService.open(message, ['Có', 'Không']).subscribe((d) => {
        if (d === 'Có') {
            this.isLoading = true;
            this.albumService.exportAlbum(type, data$).subscribe(
                (data) => {
                    const blob = new Blob([data], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    });
                    const url = window.URL.createObjectURL(blob);
                    window.open(url);
                    this.isLoading = false;
                },
                (err) => {
                    this.snackbar.failureSnackBar();
                },
            );
        }
    });
}
handleEmitMessage(e: any) {
  switch (e) {
      case 'Được chọn': {
          if (this.selectedIds.length) {
              this.Export(
                  TypeExport.Selected,
                  this.selectedIds,
                  `Bạn có muốn xuất ${this.selectedIds.length} album không?`,
              );
          }
          break;
      }
      case 'Điều kiện tìm': {
          if (this.album.length) {
              this.Export(
                  TypeExport.Filter,
                  this.request,
                  `Bạn có muốn xuất ${this.album.length} album không?`,
              );
          }
          break;
      }
  }
}

exportMenu = {
  title: 'Xuất dữ liệu',
  leftTitleIcon: 'fa-file-export',
  listMenuPosition: [
      { title: 'Được chọn', leftIcon: 'fa-circle-check', value: 'Được chọn' },
      { title: 'Điều kiện tìm', leftIcon: 'fa-filter', value: 'Điều kiện tìm' },
  ],
};

}
