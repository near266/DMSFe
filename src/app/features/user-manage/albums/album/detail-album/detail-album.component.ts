import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Subscription } from 'rxjs';
import { Album } from 'src/app/core/model/Album';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AlbumService } from '../../services/album.service';

@Component({
  selector: 'app-detail-album',
  templateUrl: './detail-album.component.html',
  styleUrls: ['./detail-album.component.scss']
})
export class DetailAlbumComponent implements OnInit {

  @ViewChild('myForm') myForm: NgForm;
  @ViewChild('submitButton') submitButton: ElementRef;
  @Input() albumModel: Album | null;
  @Input() status: string;
  @Input() dialogMode: 'create' | 'edit' | 'view' = 'create';
  form = new FormGroup({});
  subscription = new Subscription();
  subscription2 = new Subscription();

  model = {
    id: null,
    albumName: null,
    albumCode: null,
    unitTreeGroupId: null,
    deptLimit: null,
    status: null,
  };

  fields: FormlyFieldConfig[] = [
    {
        key: 'id',
    },
    {
        key: 'albumCode',
        type: 'album-input',
        defaultValue: null,
        templateOptions: {
            label: 'Mã album',
            placeholder: 'Nhập code album ảnh',
            required: true,
        },
    },
    {
        key: 'albumName',
        type: 'album-input',
        templateOptions: {
            label: 'Album ảnh',
            placeholder: 'Nhập album ảnh',
            required: true,
        },
    },
    {
        key: 'deptLimit',
        type: 'album-select',
        defaultValue: null,
        templateOptions: {
            label: 'Giới hạn phòng ban',
            required: true,
            options: [
                { value: true, label: 'Giới hạn' },
                { value: false, label: 'Không giới hạn' },
            ],
        },
    },
    {
        key: 'status',
        type: 'area-select',
        defaultValue: null,
        templateOptions: {
            label: 'Trạng thái',
            required: true,
            options: [
                { value: true, label: 'Mở' },
                { value: false, label: 'Khóa' },
            ],
        },
    },
  ];

  onSubmit(album: Album) {
      if (!this.form.invalid) {
          if (!album.id) {
            delete album.id;
            this.albumService.addAlbum(album).subscribe({
                next: (res) => {
                    this.snackbar.openSnackbar('Thêm thành công', 2000, 'Đóng', 'center', 'top', true);
                    this.dialogRef.close({event: true});
                },
                error: (err) => {
                    console.log(err);
                },
            });
        } else {
            // console.log(brand);
            this.albumService.updateAlbum(album).subscribe({
                next: (res) => {
                    this.snackbar.openSnackbar('Sửa khu vực thành công', 2000, 'Đóng', 'center', 'bottom', true);
                    this.dialogRef.close({event: true});
                },
                error: (err) => {
                    this.snackbar.openSnackbar('Sửa khu vực thất bại', 2000, 'Đóng', 'center', 'bottom', true);
                    console.log(err);
                },
            });
        }
    }
  }

  constructor(
    public dialogRef: MatDialogRef<DetailAlbumComponent>,
    private snackbar: SnackbarService,
    private albumService: AlbumService,
  ) { }

  ngOnInit(): void {
    this.albumService.changeHeader('');
    setTimeout(() => {
        if (this.albumModel) {
            // console.log(this.albumModel);
            this.form.patchValue(this.albumModel || {});
            this.albumService.changeHeader(this.albumModel.albumName || '');
            this.form.disable();
        }
    }, 0);
    this.subscription = this.albumService.submitForm$.subscribe(() => {
        this.submitButton.nativeElement.click();
    });
    this.subscription2 = this.albumService.toggleEdit$.subscribe((value: boolean) => {
        if (value) {
            this.form.enable();
        }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }

  close() {
    this.dialogRef.close();
  }

}
