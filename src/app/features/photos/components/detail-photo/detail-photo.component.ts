import { DatePipe } from '@angular/common'
import { Component, OnInit, Inject, AfterViewInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Album, CheckIn, DetailPhoto } from '../../models/DetailPhoto'
import { LogicService } from '../../services/logic.service'

@Component({
    selector: 'app-detail-photo',
    templateUrl: './detail-photo.component.html',
    styleUrls: ['./detail-photo.component.scss'],
})
export class DetailPhotoComponent implements OnInit, AfterViewInit {
    photo: DetailPhoto = {
        checkIn: new CheckIn(),
        album: new Album(),
        image: [],
    }
    currentIndex = 0

    constructor(
        public dialogRef: MatDialogRef<DetailPhotoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: string,
        private logic: LogicService,
        public datePipe: DatePipe
    ) {}
    ngAfterViewInit(): void {
        this.logic.getDetailPhoto(this.data)
        this.logic.detailPhoto$.subscribe((data) => {
            Promise.resolve().then(() => {
                this.photo = data
            })
        })
    }

    ngOnInit(): void {}

    close() {
        this.dialogRef.close()
    }
    slide(type: string) {
        console.log(this.currentIndex);

        if (type == 'prev') {
            if (this.currentIndex <= 0) {
                Promise.resolve().then(() => {
                    this.currentIndex = this.photo.image.length-1
                    return
                })
            } else {
                Promise.resolve().then(() => {
                    this.currentIndex = this.currentIndex - 1
                    return
                })
            }
        }
        if (type == 'aft') {
            if (this.currentIndex == this.photo.image.length-1) {
                Promise.resolve().then(() => {
                    this.currentIndex = 0
                    return
                })
            } else {
                Promise.resolve().then(() => {
                    this.currentIndex = this.currentIndex + 1
                    return
                })
            }
        }
    }
}
