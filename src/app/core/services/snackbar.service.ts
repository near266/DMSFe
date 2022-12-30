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
        panelClassAdd?: string[],
    ) {
        let panelClass;
        let listClassAdd = new Array();
        if (panelClassAdd) {
            listClassAdd = panelClassAdd;
        }
        if (status === true) {
            panelClass = [...listClassAdd, 'bg-green-500', 'text-white', 'w-fit', 'whitespace-pre-wrap'];
        } else {
            panelClass = [...listClassAdd, 'bg-yellow-500', 'text-white', 'w-fit', 'whitespace-pre-wrap'];
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
