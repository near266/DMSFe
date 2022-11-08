import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { values } from 'lodash';
import { Subscription } from 'rxjs';
import { RolesService } from 'src/app/core/services/roles.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { Unit } from 'src/app/features/product/models/product';
import { UnitService } from '../services/unit.service';

@Component({
  selector: 'app-detail-unit',
  templateUrl: './detail-unit.component.html',
  styleUrls: ['./detail-unit.component.scss']
})
export class DetailUnitComponent implements OnInit {

  mode: 'edit' | 'create' | 'view' = 'create';
  header = 'Thêm mới sản phẩm';
  Unit = '';
  id: any;

  subscription: Subscription = new Subscription();

  constructor(
    private unitService: UnitService,
    private rolesService: RolesService,
    private snackbar: SnackbarService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public unit: Unit | null,
  ) {
    if (unit) {
      this.header = 'Cập nhật sản phẩm';
  }
   }

  ngOnInit(): void {
    this.subscribeHeaderChanges();
      if (this.unit) {
          this.mode = 'view';
      }
  }

  requiredRoles(role: string) {
    return this.rolesService.requiredRoles(role);
  }

  private subscribeHeaderChanges() {
    this.subscription = this.unitService.header$.subscribe((value) => {
        this.Unit = value;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleEditMode(): void {
      this.mode = 'edit';
      this.unitService.toggleEdit$.next(true);
  }
  submitForm(): void {
      this.unitService.submitForm$.next(true);
  }
  submitChange(): void {
      this.unitService.submitForm$.next(true);
  }
  deleteProduct(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
            content: 'Bạn có chắc chắn muốn xóa sản phẩm này không',
            action: ['Xóa', 'Hủy'],
        },
    });
    let body = {id: [this.unit?.id]}
    // console.log(this.unit?.id);
    console.log(body)
    dialogRef.afterClosed().subscribe((data: any) => {
        if (data === 'Xóa') {
            this.unitService.del(body);
            this.snackbar.openSnackbar('Xóa đơn vị thành công', 2000, 'Đóng', 'center', 'bottom', true);
            this.dialog.closeAll();
        }else {
        }
    });
  }

}
