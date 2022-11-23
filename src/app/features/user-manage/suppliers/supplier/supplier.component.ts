import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RolesService } from 'src/app/core/services/roles.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { Supplier } from 'src/app/features/product/models/product';
import { SupplierService } from '../services/supplier.service';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {

  mode: 'edit' | 'create' | 'view' = 'create';
  header = 'Thêm mới sản phẩm';
  Supplier = '';
  id: any;

  subscription: Subscription = new Subscription();

  constructor(
    private supplierService: SupplierService,
    private rolesService: RolesService,
    private snackbar: SnackbarService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SupplierComponent>,
    @Inject(MAT_DIALOG_DATA) public supplier: Supplier | null,
  ) {
    if (supplier) {
      this.header = 'Cập nhật sản phẩm';
    }
  }

  ngOnInit(): void {
    this.subscribeHeaderChanges();
      if (this.supplier) {
          this.mode = 'view';
      }
  }

  requiredRoles(role: string) {
    return this.rolesService.requiredRoles(role);
  }

  private subscribeHeaderChanges() {
    this.subscription = this.supplierService.header$.subscribe((value) => {
        this.Supplier = value;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleEditMode(): void {
      this.mode = 'edit';
      this.supplierService.toggleEdit$.next(true);
  }
  submitForm(): void {
      this.supplierService.submitForm$.next(true);
  }
  submitChange(): void {
      this.supplierService.submitForm$.next(true);
  }
  del(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
            content: 'Bạn có chắc chắn muốn xóa nhà cung cấp này không',
            action: ['Xóa', 'Hủy'],
        },
    });
    let body = {id: [this.supplier?.id]}
    dialogRef.afterClosed().subscribe((data: any) => {
        if (data.includes('Xóa')) {
            this.supplierService.del(body).subscribe(data => {
              this.dialogRef.close({event: true});
              this.snackbar.openSnackbar('Xóa nhà cung cấp thành công', 2000, 'Đóng', 'center', 'bottom', true);
            });            
        }else {
        }
    });
  }

}
