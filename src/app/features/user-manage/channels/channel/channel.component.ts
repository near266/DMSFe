import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Channel } from 'src/app/core/model/Channel';
import { RolesService } from 'src/app/core/services/roles.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { ChannelService } from '../services/channel.service';

@Component({
    selector: 'app-channel',
    templateUrl: './channel.component.html',
    styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnInit {
    mode: 'edit' | 'create' | 'view' = 'create';
    header = 'Thêm mới sản phẩm';
    Channel = '';
    id: any;

    subscription: Subscription = new Subscription();

    constructor(
        private channelService: ChannelService,
        private rolesService: RolesService,
        private snackbar: SnackbarService,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<ChannelComponent>,
        @Inject(MAT_DIALOG_DATA) public channel: Channel | null,
    ) {
        if (channel) {
            this.header = 'Cập nhật sản phẩm';
        }
    }

    ngOnInit(): void {
        this.subscribeHeaderChanges();
        if (this.channel) {
            this.mode = 'view';
        }
    }

    requiredRoles(role: string) {
        return this.rolesService.requiredRoles(role);
    }

    private subscribeHeaderChanges() {
        this.subscription = this.channelService.header$.subscribe((value) => {
            this.Channel = value;
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    toggleEditMode(): void {
        this.mode = 'edit';
        this.channelService.toggleEdit$.next(true);
    }
    submitForm(): void {
        this.channelService.submitForm$.next(true);
    }
    submitChange(): void {
        this.channelService.submitForm$.next(true);
    }
    del(): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                content: 'Bạn có chắc chắn muốn xóa kênh này không',
                action: ['Xóa', 'Hủy'],
            },
        });
        let body = { listId: [this.channel?.id] };
        dialogRef.afterClosed().subscribe((data: any) => {
            if (data.includes('Xóa')) {
                this.channelService.del(body).subscribe((data) => {
                    this.dialogRef.close({ event: true });
                    this.snackbar.openSnackbar('Xóa kênh thành công', 2000, 'Đóng', 'center', 'bottom', true);
                });
            } else {
            }
        });
    }
}
