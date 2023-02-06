import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Area } from 'src/app/core/model/Area';
import { RolesService } from 'src/app/core/services/roles.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { AreaService } from '../services/area.service';

@Component({
    selector: 'app-area',
    templateUrl: './area.component.html',
    styleUrls: ['./area.component.scss'],
})
export class AreaComponent implements OnInit {
    mode: 'edit' | 'create' | 'view' = 'create';
    header = 'Thêm mới sản phẩm';
    Area = '';
    id: any;

    subscription: Subscription = new Subscription();

    constructor(
        private areaService: AreaService,
        private rolesService: RolesService,
        private snackbar: SnackbarService,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<AreaComponent>,
        @Inject(MAT_DIALOG_DATA) public area: Area | null,
    ) {
        if (area) {
            this.header = 'Cập nhật sản phẩm';
        }
    }

    ngOnInit(): void {
        this.subscribeHeaderChanges();
        if (this.area) {
            this.mode = 'view';
        }
    }

    requiredRoles(role: string) {
        return this.rolesService.requiredRoles(role);
    }

    private subscribeHeaderChanges() {
        this.subscription = this.areaService.header$.subscribe((value) => {
            this.Area = value;
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    toggleEditMode(): void {
        this.mode = 'edit';
        this.areaService.toggleEdit$.next(true);
    }
    submitForm(): void {
        this.areaService.submitForm$.next(true);
    }
    submitChange(): void {
        this.areaService.submitForm$.next(true);
    }
    del(): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                content: 'Bạn có chắc chắn muốn xóa khu vực này không',
                action: ['Xóa', 'Hủy'],
            },
        });
        let body = { listId: [this.area?.id] };
        dialogRef.afterClosed().subscribe((data: any) => {
            if (data.includes('Xóa')) {
                this.areaService.del(body).subscribe((data) => {
                    this.dialogRef.close({ event: true });
                    this.snackbar.openSnackbar('Xóa khu vực thành công', 2000, 'Đóng', 'center', 'bottom', true);
                });
            } else {
            }
        });
    }
}
