import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Album } from 'src/app/core/model/Album';
import { RolesService } from 'src/app/core/services/roles.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { AlbumService } from '../services/album.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {

  mode: 'edit' | 'create' | 'view' = 'create';
  header = 'Thêm mới sản phẩm';
  Album = '';
  id: any;

  subscription: Subscription = new Subscription();

  constructor(
    private albumService: AlbumService,
    private rolesService: RolesService,
    private snackbar: SnackbarService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AlbumComponent>,
    @Inject(MAT_DIALOG_DATA) public album: Album | null,
  ) {
    if (album) {
      this.header = 'Cập nhật sản phẩm';
    }
  }

  ngOnInit(): void {
    this.subscribeHeaderChanges();
      if (this.album) {
          this.mode = 'view';
      }
  }
  
  requiredRoles(role: string) {
    return this.rolesService.requiredRoles(role);
  }

  private subscribeHeaderChanges() {
    this.subscription = this.albumService.header$.subscribe((value) => {
        this.Album = value;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleEditMode(): void {
      this.mode = 'edit';
      this.albumService.toggleEdit$.next(true);
  }
  submitForm(): void {
      this.albumService.submitForm$.next(true);
  }
  submitChange(): void {
      this.albumService.submitForm$.next(true);
  }
  del(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
            content: 'Bạn có chắc chắn muốn xóa album ảnh này không',
            action: ['Xóa', 'Hủy'],
        },
    });
    let body = {listId: [this.album?.id]}
    dialogRef.afterClosed().subscribe((data: any) => {
        if (data.includes('Xóa')) {
            this.albumService.del(body).subscribe(data => {
              this.dialogRef.close({event: true});
              this.snackbar.openSnackbar('Xóa album ảnh thành công', 2000, 'Đóng', 'center', 'bottom', true);
            });            
        }else {
        }
    });
  }

}
