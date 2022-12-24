import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Response } from 'src/app/core/model/Response'
import { CheckInService } from 'src/app/core/services/check-in.service'
import { SnackbarService } from 'src/app/core/services/snackbar.service'
import { Photo } from '../models/Photo'

@Injectable({
    providedIn: 'root',
})
export class LogicService {
    private readonly defaultListPhoto: Photo[] = []

    private photos: BehaviorSubject<Photo[]> = new BehaviorSubject<Photo[]>(this.defaultListPhoto)

    public photos$ = this.photos.asObservable()

    constructor(private checkIn: CheckInService, public snackbar: SnackbarService) {}

    getListPhoto() {
        this.checkIn.getAll(1, 20).subscribe(
            (response: Response<Photo>) => {
                if (response) {
                    this.photos.next(response.data)
                } else {
                    this.snackbar.openSnackbar(
                        'Không thể tải danh sách hình ảnh',
                        2000,
                        'Đóng',
                        'center',
                        'bottom',
                        false,
                    )
                }
            },
            (error) => {
                this.snackbar.openSnackbar('Không thể tải danh sách hình ảnh', 2000, 'Đóng', 'center', 'bottom', false)
            },
        )
    }
}
