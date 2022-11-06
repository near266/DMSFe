import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';

@Injectable({
    providedIn: 'root',
})
export class ConfirmDialogService {
    constructor(private dialog: MatDialog) {}
    open(content: any, action: any) {
        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                content: content,
                action: action,
            },
        });
        return dialogRef.afterClosed();
    }
}
