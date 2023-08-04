import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

export interface DialogData {
    message: string;
    confirm: string;
    cancel: string;
}
@Injectable({
    providedIn: 'root',
})
export class ConfirmDialogService {
    [x: string]: any;
    constructor(public dialog: MatDialog) {}
    openDialog(data: DialogData) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '400px',
            height: '200px',
            data,
        });
        return dialogRef.afterClosed();
    }
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
