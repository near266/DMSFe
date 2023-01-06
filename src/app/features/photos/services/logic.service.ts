import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Album } from 'src/app/core/model/Album';
import { CustomerGroup } from 'src/app/core/model/CustomerGroup';
import { CustomerType } from 'src/app/core/model/CustomerType';
import { Response } from 'src/app/core/model/Response';
import { AlbumService } from 'src/app/core/services/album.service';
import { CheckInService } from 'src/app/core/services/check-in.service';
import { CustomerGroupService } from 'src/app/core/services/customer-group.service';
import { CustomerTypeService } from 'src/app/core/services/customer-type.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { DetailPhoto } from '../models/DetailPhoto';
import { IBody } from '../models/IBody';
import { Photo } from '../models/Photo';

@Injectable({
    providedIn: 'root',
})
export class LogicService {
    private readonly defaultListPhoto: Photo[] = [];
    private readonly defaultListType: CustomerType[] = [];
    private readonly defaultListGroup: CustomerGroup[] = [];
    private readonly defaultListAlbum: Album[] = [];

    private photos: BehaviorSubject<Photo[]> = new BehaviorSubject<Photo[]>(this.defaultListPhoto);
    private customerTypeList: BehaviorSubject<CustomerType[]> = new BehaviorSubject<CustomerType[]>(
        this.defaultListType,
    );
    private customerGroupList: BehaviorSubject<CustomerGroup[]> = new BehaviorSubject<CustomerGroup[]>(
        this.defaultListGroup,
    );
    private albumList: BehaviorSubject<Album[]> = new BehaviorSubject<Album[]>(this.defaultListAlbum);

    private totalPhoto: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    private detailPhoto: BehaviorSubject<DetailPhoto> = new BehaviorSubject<DetailPhoto>(new DetailPhoto());

    public photos$ = this.photos.asObservable();
    public customerTypeList$ = this.customerTypeList.asObservable();
    public customerGroupList$ = this.customerGroupList.asObservable();
    public albumList$ = this.albumList.asObservable();
    public totalPhoto$ = this.totalPhoto.asObservable();
    public detailPhoto$ = this.detailPhoto.asObservable();

    constructor(
        private checkIn: CheckInService,
        public snackbar: SnackbarService,
        private customerType: CustomerTypeService,
        private customerGroup: CustomerGroupService,
        private albumService: AlbumService,
    ) {}

    getCustomerType() {
        this.customerType.get_all().subscribe(
            (response) => {
                if (response) {
                    this.customerTypeList.next(response);
                } else {
                    this.customerTypeList.next(this.defaultListType);
                }
            },
            (error) => {
                this.customerTypeList.next(this.defaultListType);
            },
        );
    }

    getCustomerGroup() {
        this.customerGroup.get_all().subscribe(
            (response) => {
                if (response) {
                    this.customerGroupList.next(response);
                } else {
                    this.customerGroupList.next(this.defaultListGroup);
                }
            },
            (error) => {
                this.customerGroupList.next(this.defaultListGroup);
            },
        );
    }

    getAlbum() {
        this.albumService.getAll().subscribe(
            (response: { data: Album[]; }) => {
                if (response) {
                    this.albumList.next(response.data);
                } else {
                    this.albumList.next(this.defaultListAlbum);
                }
            },
            () => {
                this.albumList.next(this.defaultListAlbum);
            },
        );
    }

    getListPhoto(body: IBody) {
        this.checkIn.getList(body).subscribe(
            (response: Response<Photo>) => {
                if (response) {
                    if (body.page == 1) {
                        this.photos.next(response.data);
                    } else {
                        this.photos.next([...this.photos.getValue(), ...response.data]);
                    }
                    this.totalPhoto.next(response.totalCount);
                } else {
                    this.snackbar.openSnackbar(
                        'Không tìm thấy danh sách hình ảnh',
                        2000,
                        'Đóng',
                        'center',
                        'bottom',
                        false,
                    );
                    this.photos.next(this.defaultListPhoto);
                }
            },
            (error) => {
                this.snackbar.openSnackbar(
                    'Không tìm thấy danh sách hình ảnh',
                    2000,
                    'Đóng',
                    'center',
                    'bottom',
                    false,
                );
                this.photos.next(this.defaultListPhoto);
            },
        );
    }

    getDetailPhoto(id: string) {
        this.checkIn.getById(id).subscribe(
            (data) => {
                if (data) {
                    this.detailPhoto.next(data);
                } else {
                    this.snackbar.openSnackbar('Không tìm thấy album', 2000, 'Đóng', 'center', 'bottom', false);
                }
            },
            (error) => {
                this.snackbar.openSnackbar('Không tìm thấy album', 2000, 'Đóng', 'center', 'bottom', false);
            },
        );
    }
}
