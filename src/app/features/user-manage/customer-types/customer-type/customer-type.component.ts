import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CustomerType } from 'src/app/core/model/CustomerType';
import { RolesService } from 'src/app/core/services/roles.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { CustomerTypeService } from '../services/customer-type.service';

@Component({
  selector: 'app-customer-type',
  templateUrl: './customer-type.component.html',
  styleUrls: ['./customer-type.component.scss']
})
export class CustomerTypeComponent implements OnInit {

  mode: 'edit' | 'create' | 'view' = 'create';
  header = 'Thêm mới sản phẩm';
  CustomerType = '';
  id: any;

  subscription: Subscription = new Subscription();

  constructor(
    private customerTypeService: CustomerTypeService,
    private rolesService: RolesService,
    private snackbar: SnackbarService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CustomerTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public customerType: CustomerType | null,
  ) {
    if (customerType) {
      this.header = 'Cập nhật sản phẩm';
    }
  }

  ngOnInit(): void {
    this.subscribeHeaderChanges();
      if (this.customerType) {
          this.mode = 'view';
      }
  }

  requiredRoles(role: string) {
    return this.rolesService.requiredRoles(role);
  }

  private subscribeHeaderChanges() {
    this.subscription = this.customerTypeService.header$.subscribe((value) => {
        this.CustomerType = value;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleEditMode(): void {
      this.mode = 'edit';
      this.customerTypeService.toggleEdit$.next(true);
  }
  submitForm(): void {
      this.customerTypeService.submitForm$.next(true);
  }
  submitChange(): void {
      this.customerTypeService.submitForm$.next(true);
  }
  del(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
            content: 'Bạn có chắc chắn muốn xóa loại khách hàng này không',
            action: ['Xóa', 'Hủy'],
        },
    });
    let body = {listId: [this.customerType?.id]}
    dialogRef.afterClosed().subscribe((data: any) => {
        if (data.includes('Xóa')) {
            this.customerTypeService.del(body).subscribe(data => {
              this.dialogRef.close({event: true});
              this.snackbar.openSnackbar('Xóa nhóm khách hàng thành công', 2000, 'Đóng', 'center', 'bottom', true);
            });            
        }else {
        }
    });
  }

}
