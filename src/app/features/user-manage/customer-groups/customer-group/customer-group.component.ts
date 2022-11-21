import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CustomerGroup } from 'src/app/core/model/CustomerGroup';
import { RolesService } from 'src/app/core/services/roles.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { CustomerGroupsService } from '../services/customer-groups.service';

@Component({
  selector: 'app-customer-group',
  templateUrl: './customer-group.component.html',
  styleUrls: ['./customer-group.component.scss']
})
export class CustomerGroupComponent implements OnInit {

  mode: 'edit' | 'create' | 'view' = 'create';
  header = 'Thêm mới sản phẩm';
  CustomerGroup = '';
  id: any;

  subscription: Subscription = new Subscription();

  constructor(
    private customerGroupService: CustomerGroupsService,
    private rolesService: RolesService,
    private snackbar: SnackbarService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CustomerGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public customerGroup: CustomerGroup | null,
  ) {
    if (customerGroup) {
      this.header = 'Cập nhật sản phẩm';
    }
  }

  ngOnInit(): void {
    this.subscribeHeaderChanges();
      if (this.customerGroup) {
          this.mode = 'view';
      }
  }

  requiredRoles(role: string) {
    return this.rolesService.requiredRoles(role);
  }

  private subscribeHeaderChanges() {
    this.subscription = this.customerGroupService.header$.subscribe((value) => {
        this.CustomerGroup = value;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleEditMode(): void {
      this.mode = 'edit';
      this.customerGroupService.toggleEdit$.next(true);
  }
  submitForm(): void {
      this.customerGroupService.submitForm$.next(true);
  }
  submitChange(): void {
      this.customerGroupService.submitForm$.next(true);
  }
  deleteProduct(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
            content: 'Bạn có chắc chắn muốn xóa nhóm khách hàng này không',
            action: ['Xóa', 'Hủy'],
        },
    });
    let body = {listId: [this.customerGroup?.id]}
    dialogRef.afterClosed().subscribe((data: any) => {
        if (data.includes('Xóa')) {
            this.customerGroupService.del(body).subscribe(data => {
              this.dialogRef.close({event: true});
              this.snackbar.openSnackbar('Xóa nhóm khách hàng thành công', 2000, 'Đóng', 'center', 'bottom', true);
            });            
        }else {
        }
    });
  }

}
