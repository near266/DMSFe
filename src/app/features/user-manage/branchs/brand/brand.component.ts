import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RolesService } from 'src/app/core/services/roles.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { Brand } from 'src/app/features/product/models/product';
import { BranchService } from '../services/branch.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {

  mode: 'edit' | 'create' | 'view' = 'create';
  header = 'Thêm mới sản phẩm';
  Brand = '';
  id: any;

  subscription: Subscription = new Subscription();

  constructor(
    private brandService: BranchService,
    private rolesService: RolesService,
    private snackbar: SnackbarService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BrandComponent>,
    @Inject(MAT_DIALOG_DATA) public brand: Brand | null,
  ) {
    if (brand) {
      this.header = 'Cập nhật sản phẩm';
    }
  }

  ngOnInit(): void {
    this.subscribeHeaderChanges();
      if (this.brand) {
          this.mode = 'view';
      }
  }

  requiredRoles(role: string) {
    return this.rolesService.requiredRoles(role);
  }

  private subscribeHeaderChanges() {
    this.subscription = this.brandService.header$.subscribe((value) => {
        this.Brand = value;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleEditMode(): void {
      this.mode = 'edit';
      this.brandService.toggleEdit$.next(true);
  }
  submitForm(): void {
      this.brandService.submitForm$.next(true);
  }
  submitChange(): void {
      this.brandService.submitForm$.next(true);
  }
  deleteProduct(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
            content: 'Bạn có chắc chắn muốn xóa sản phẩm này không',
            action: ['Xóa', 'Hủy'],
        },
    });
    let body = {id: [this.brand?.id]}
    dialogRef.afterClosed().subscribe((data: any) => {
        if (data.includes('Xóa')) {
            this.brandService.del(body).subscribe(data => {
              this.dialogRef.close({event: true});
              this.snackbar.openSnackbar('Xóa đơn vị thành công', 2000, 'Đóng', 'center', 'bottom', true);
            });            
        }else {
        }
    });
  }

}
