import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';

export interface DialogData {
    message: string;
    confirm: string;
    cancel: string;
}
@Injectable({
    providedIn: 'root',
})
export class ConfirmDialogService {
    constructor(public dialog: MatDialog) {}
    openDialog(data: DialogData) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '400px',
            height: '200px',
            data,
        });
        return dialogRef.afterClosed();
    }
}
