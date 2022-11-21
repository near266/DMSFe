import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root',
})
export class SnackbarService {
    constructor(private _snackbar: MatSnackBar) {}
    public openSnackbar(
        message: string,
        duration: number,
        action: string | undefined,
        horizontalPosition: MatSnackBarHorizontalPosition,
        verticalPosition: MatSnackBarVerticalPosition,
        status: boolean,
    ) {
        let panelClass;
        if (status === true) {
            panelClass = ['bg-green-500', 'text-white', 'w-fit'];
        } else {
            panelClass = ['bg-yellow-500', 'text-white', 'w-fit'];
        }
        this._snackbar.open(message, action, {
            panelClass: panelClass,
            horizontalPosition: horizontalPosition,
            verticalPosition: verticalPosition,
            duration: duration,
        });
    }
    public failureSnackBar() {
        this.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'bottom', false);
    }

    public successSnackBar() {
        this.openSnackbar('Cập nhật thành công', 2000, 'Đóng', 'center', 'bottom', true);
    }
}
