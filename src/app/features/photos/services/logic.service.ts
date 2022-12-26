import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Response } from 'src/app/core/model/Response'
import { CheckInService } from 'src/app/core/services/check-in.service'
import { SnackbarService } from 'src/app/core/services/snackbar.service'
import { DetailPhoto } from '../models/DetailPhoto'
import { Photo } from '../models/Photo'

@Injectable({
    providedIn: 'root',
})
export class LogicService {
    private readonly defaultListPhoto: Photo[] = []

    private photos: BehaviorSubject<Photo[]> = new BehaviorSubject<Photo[]>(this.defaultListPhoto)

    private totalPhoto: BehaviorSubject<number> = new BehaviorSubject<number>(0)

    private detailPhoto: BehaviorSubject<DetailPhoto> = new BehaviorSubject<DetailPhoto>(new DetailPhoto)

    public photos$ = this.photos.asObservable()
    public totalPhoto$ = this.totalPhoto.asObservable()
    public detailPhoto$ = this.detailPhoto.asObservable()

    constructor(private checkIn: CheckInService, public snackbar: SnackbarService) {}

    private photoInService: Photo[] = []

    getListPhoto() {
        this.checkIn.getAll(1, 8).subscribe(
            (response: Response<Photo>) => {
                if (response) {
                    this.photoInService = response.data
                    this.photos.next(response.data)
                    this.totalPhoto.next(response.totalCount)
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

    loadPhoto(page: number) {
        this.checkIn.getAll(page, 8).subscribe(
            (response: Response<Photo>) => {
                if (response) {
                    if (page == 1) {
                        this.photoInService = response.data
                    } else {
                        this.photoInService = this.photoInService.concat(response.data)
                    }
                    this.photos.next(this.photoInService)
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

    getDetailPhoto(id: string) {
        this.checkIn.getById(id).subscribe(data => {
            if(data) {
                this.detailPhoto.next(data)
            } else {
                this.snackbar.openSnackbar('Không tìm thấy album', 2000, 'Đóng', 'center', 'bottom', false)
            }
        }, (error) => {
            this.snackbar.openSnackbar('Không tìm thấy album', 2000, 'Đóng', 'center', 'bottom', false)
        })
    }
}
