import { AfterViewInit, Component, OnInit } from '@angular/core'
import { LogicService } from '../../services/logic.service'
import { Photo } from '../../models/Photo'
import { DatePipe } from '@angular/common'
import { MatDialog } from '@angular/material/dialog'
import { DetailPhotoComponent } from '../detail-photo/detail-photo.component'
import { Router } from '@angular/router'

@Component({
    selector: 'app-photo-new-customer',
    templateUrl: './photo-new-customer.component.html',
    styleUrls: ['./photo-new-customer.component.scss'],
})
export class PhotoNewCustomerComponent implements OnInit, AfterViewInit {
    photo: Photo[] = []
    totalCount = 0
    page: number = 1
    showLoadMore: boolean = true

    listMenuObj = [
        {
            title: 'Sắp xếp',
            leftTitleIcon: 'fa-arrow-down-a-z',
            listMenuPosition: [
                { title: 'Thời gian', leftIcon: 'fa-arrow-down', value: 'down' },
                { title: 'Thời gian', leftIcon: 'fa-arrow-up', value: 'up' },
            ],
        },
        {
            title: 'Loại khách hàng',
            leftTitleIcon: 'fa-cubes',
            listMenuPosition: [
                { title: 'Tiềm năng', leftIcon: '', value: '' },
                { title: 'Thân thiết', leftIcon: '', value: '' },
                { title: 'Vãng lai', leftIcon: '', value: '' },
            ],
        },
        {
            title: 'Nhóm khách hàng',
            leftTitleIcon: 'fa-user-group',
            listMenuPosition: [
                { title: 'Tiềm năng', leftIcon: '', value: '' },
                { title: 'Thân thiết', leftIcon: '', value: '' },
                { title: 'Vãng lai', leftIcon: '', value: '' },
            ],
        },
        {
            title: 'Album',
            leftTitleIcon: 'fa-image',
            listMenuPosition: [
                { title: 'Tiềm năng', leftIcon: '', value: '' },
                { title: 'Thân thiết', leftIcon: '', value: '' },
                { title: 'Vãng lai', leftIcon: '', value: '' },
            ],
        },
        {
            title: 'Viếng thăm',
            leftTitleIcon: 'fa-recycle',
            listMenuPosition: [
                { title: 'Tiềm năng', leftIcon: '', value: '' },
                { title: 'Thân thiết', leftIcon: '', value: '' },
                { title: 'Vãng lai', leftIcon: '', value: '' },
            ],
        },
        {
            title: 'Thông tin',
            leftTitleIcon: 'fa-info',
            listMenuPosition: [
                { title: 'Tiềm năng', leftIcon: '', value: '' },
                { title: 'Thân thiết', leftIcon: '', value: '' },
                { title: 'Vãng lai', leftIcon: '', value: '' },
            ],
        },
    ]

    constructor(
        private logic: LogicService,
        public datePipe: DatePipe,
        private dialog: MatDialog,
        private router: Router,
    ) {}

    ngAfterViewInit(): void {
        this.logic.getListPhoto()
        this.logic.photos$.subscribe((data) => {
            this.photo = data
        })
        this.logic.totalPhoto$.subscribe((data) => {
            this.totalCount = data
        })
    }

    ngOnInit(): void {}

    detail(id: string) {
        let sub = this.dialog.open(DetailPhotoComponent, {
            height: '100vh',
            minWidth: '1000px',
            panelClass: 'custom-mat-dialog-container',
            autoFocus: false,
            data: id,
        })
        sub.afterClosed().subscribe((event) => {})
    }

    routeToCustomer(id: string) {
        this.router.navigate(['customers'])
    }

    loadMore() {
        this.page++
        this.logic.loadPhoto(this.page)
    }

    Select(event: any) {}
}
