import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { LogicService } from '../../services/logic.service';
import { Photo } from '../../models/Photo';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DetailPhotoComponent } from '../detail-photo/detail-photo.component';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { IBody } from '../../models/IBody';

@Component({
    selector: 'app-photo-new-customer',
    templateUrl: './photo-new-customer.component.html',
    styleUrls: ['./photo-new-customer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoNewCustomerComponent implements OnInit, AfterViewInit, OnDestroy {
    private _subPhoto: Subscription;
    private _subTotal: Subscription;

    photo: Photo[] = [];
    totalCount = 0;
    page: number = 1;
    showLoadMore: boolean = true;
    body: IBody = {
        page: 1,
        pagesize: 8,
    };

    listMenuObj = [
        {
            title: 'Sắp xếp',
            leftTitleIcon: 'fa-arrow-down-a-z',
            listMenuPosition: [
                { title: 'Thời gian', leftIcon: 'fa-arrow-down', value: 'time-down' },
                { title: 'Thời gian', leftIcon: 'fa-arrow-up', value: 'time-up' },
            ],
        },
        {
            title: 'Loại khách hàng',
            leftTitleIcon: 'fa-cubes',
            listMenuPosition: [],
        },
        {
            title: 'Nhóm khách hàng',
            leftTitleIcon: 'fa-user-group',
            listMenuPosition: [],
        },
        {
            title: 'Album',
            leftTitleIcon: 'fa-image',
            listMenuPosition: [],
        },
    ];

    constructor(
        public logic: LogicService,
        public datePipe: DatePipe,
        private dialog: MatDialog,
        private router: Router,
        private title: Title,
    ) {}
    ngOnDestroy(): void {
        this._subPhoto.unsubscribe();
        this._subTotal.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.logic.getListPhoto(this.body);
        this._subPhoto = this.logic.photos$.subscribe((data) => {
            Promise.resolve().then(() => {
                this.photo = data;
            });
        });
        this._subTotal = this.logic.totalPhoto$.subscribe((data) => {
            Promise.resolve().then(() => {
                this.totalCount = data;
            });
        });
        this.logic.getCustomerGroup();
        this.logic.customerGroupList$.subscribe((data) => {
            if (data) {
                this.listMenuObj[2].listMenuPosition = [];
                this.listMenuObj[2].listMenuPosition.push({
                    title: `Tất cả`,
                    leftIcon: '',
                    value: 'Group;;' + `root`,
                });
                data.forEach((element) => {
                    this.listMenuObj[2].listMenuPosition.push({
                        title: `${element.customerGroupName}`,
                        leftIcon: '',
                        value: 'Group;;' + `${element.id}`,
                    });
                });
            }
        });
        this.logic.getCustomerType();
        this.logic.customerTypeList$.subscribe((data) => {
            if (data) {
                this.listMenuObj[1].listMenuPosition = [];
                this.listMenuObj[1].listMenuPosition.push({
                    title: `Tất cả`,
                    leftIcon: '',
                    value: 'Type;;' + `root`,
                });
                data.forEach((element) => {
                    this.listMenuObj[1].listMenuPosition.push({
                        title: `${element.customerTypeName}`,
                        leftIcon: '',
                        value: 'Type;;' + `${element.id}`,
                    });
                });
            }
        });
        this.logic.getAlbum();
        this.logic.albumList$.subscribe((data) => {
            if (data) {
                this.listMenuObj[3].listMenuPosition = [];
                this.listMenuObj[3].listMenuPosition.push({
                    title: `Tất cả`,
                    leftIcon: '',
                    value: 'Album;;' + `root`,
                });
                data.forEach((element) => {
                    this.listMenuObj[3].listMenuPosition.push({
                        title: `${element.albumName}`,
                        leftIcon: '',
                        value: 'Album;;' + `${element.id}`,
                    });
                });
            }
        });
    }

    ngOnInit(): void {
        this.title.setTitle('Hình ảnh viếng thăm');
    }

    trackByFn(index: number, item: any) {
        if (!item) return null;
        return item.checkIn.id;
    }

    detail(id: string) {
        let sub = this.dialog.open(DetailPhotoComponent, {
            height: '100vh',
            minWidth: '1000px',
            panelClass: 'custom-mat-dialog-container',
            autoFocus: false,
            data: id,
        });
        sub.afterClosed().subscribe((event) => {});
    }

    routeToCustomer(id: string) {
        this.router.navigate(['customers/' + id]);
    }

    loadMore() {
        this.page++;
        this.body.page++;
        this.logic.getListPhoto(this.body);
    }

    search(event: any) {
        this.body.page = 1;
        this.body.keyword = event;
        this.logic.getListPhoto(this.body);
    }

    Select(event: string) {
        let type = event.split(';;')[0];
        let value = event.split(';;')[1];
        switch (type) {
            case 'Album':
                if (value != 'root') {
                    this.body.albumId = value;
                } else this.body.albumId = null;
                break;
            case 'Type':
                if (value != 'root') {
                    this.body.customerTypeId = value;
                } else this.body.customerTypeId = null;
                break;
            case 'Group':
                if (value != 'root') {
                    this.body.customerGroupId = value;
                } else this.body.customerGroupId = null;
                break;
        }
        this.body.page = 1;
        this.logic.getListPhoto(this.body);
    }

    reload() {
        this.body.page = 1;
        this.logic.getListPhoto(this.body);
    }
}
