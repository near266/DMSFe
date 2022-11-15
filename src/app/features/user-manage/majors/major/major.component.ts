import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RolesService } from 'src/app/core/services/roles.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { Major } from 'src/app/features/product/models/product';
import { MajorService } from '../services/major.service';

@Component({
  selector: 'app-major',
  templateUrl: './major.component.html',
  styleUrls: ['./major.component.scss']
})
export class MajorComponent implements OnInit {

  mode: 'edit' | 'create' | 'view' = 'create';
  header = 'Thêm mới sản phẩm';
  Major = '';
  id: any;

  subscription: Subscription = new Subscription();

  constructor(
    private majorService: MajorService,
    private rolesService: RolesService,
    private snackbar: SnackbarService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<MajorComponent>,
    @Inject(MAT_DIALOG_DATA) public major: Major | null,
  ) { 
    if (major) {
      this.header = 'Cập nhật sản phẩm';
    }
  }

  ngOnInit(): void {
    this.subscribeHeaderChanges();
      if (this.major) {
          this.mode = 'view';
      }
  }

  requiredRoles(role: string) {
    return this.rolesService.requiredRoles(role);
  }

  private subscribeHeaderChanges() {
    this.subscription = this.majorService.header$.subscribe((value) => {
        this.Major = value;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleEditMode(): void {
      this.mode = 'edit';
      this.majorService.toggleEdit$.next(true);
  }
  submitForm(): void {
      this.majorService.submitForm$.next(true);
  }
  submitChange(): void {
      this.majorService.submitForm$.next(true);
  }
  deleteProduct(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
            content: 'Bạn có chắc chắn muốn xóa sản phẩm này không',
            action: ['Xóa', 'Hủy'],
        },
    });
    let body = {id: this.major?.id}
    dialogRef.afterClosed().subscribe((data: any) => {
      if (data.includes('Xóa')) {
          this.majorService.del(body).subscribe(data => {
            this.dialogRef.close({event: true});
            this.snackbar.openSnackbar('Xóa đơn vị thành công', 2000, 'Đóng', 'center', 'bottom', true);
          });            
      }else {
      }
    });
  }

}
