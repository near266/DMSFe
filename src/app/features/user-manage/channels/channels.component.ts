import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Channel } from 'src/app/core/model/Channel';
import { ConfirmDialogService } from 'src/app/core/services/confirmDialog.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AddChannelComponent } from './add-channel/add-channel.component';
import { ChannelComponent } from './channel/channel.component';
import { ChannelService } from './services/channel.service';

@Component({
    selector: 'app-channels',
    templateUrl: './channels.component.html',
    styleUrls: ['./channels.component.scss'],
})
export class ChannelsComponent implements OnInit {
    loading = true;
    sideBarWidth!: string;
    type!: string;
    selectedIds: string[] = [];
    channel: Channel[] = [];
    totalCount: number;
    keywords: '';
    request: any = {
        keyword: '',
        status: null,
        page: 1,
        pageSize: 30,
    };

    res: any;
    dia?: any;
    page: number = 1;
    pageSize: number = 30;
    total: number = 0;
    totalchannels: number;

    constructor(
        public datepipe: DatePipe,
        private dialog: MatDialog,
        private channelService: ChannelService,
        private snackbar: SnackbarService,
        private confirmService: ConfirmDialogService,
    ) {}

    ngOnInit(): void {
        this.view();
    }

    view() {
        this.channelService.getAllChannel(this.request).subscribe((data) => {
            if (data) {
                this.channel = data.list;
                this.totalchannels = data.list.length;
                // console.log(data);
            }
        });
    }

    AddChannel() {
        const dialogRef = this.dialog.open(AddChannelComponent, {
            height: '100vh',
            minWidth: '900px',
            panelClass: 'custom-mat-dialog-container',
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result?.event === true) {
                this.view();
            }
        });
    }

    open(data: Channel | null = null) {
        const dialogRef = this.dialog.open(ChannelComponent, {
            width: '730px',
            height: '90vh',
            data,
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result?.event === true) {
                this.view();
            }
        });
    }

    search(request: any) {
        this.loading = true;
        if (request) {
            request = ('' + request).trim();
        }
        if (request == null || request == undefined) {
            this.keywords = '';
        } else {
            this.keywords = request;
        }
        this.request.keyword = this.keywords;
        this.channelService.searchChannel(this.request).subscribe(
            (data) => {
                this.loading = false;
                if (data) {
                    this.channel = data.list;
                }
            },
            (error) => {
                this.loading = false;
                this.snackbar.openSnackbar(error, 2000, 'Đóng', 'center', 'bottom', true);
            },
        );
    }

    Select(e: string) {
        if (e.includes('Tất cả')) {
            this.request.keyword = this.keywords;
            this.request.status = null;
            this.channelService.searchChannel(this.request).subscribe(
                (data) => {
                    this.loading = false;
                    if (data) {
                        this.channel = data.list;
                    }
                },
                (error) => {
                    this.loading = false;
                    this.snackbar.openSnackbar(error, 2000, 'Đóng', 'center', 'bottom', true);
                },
            );
            return;
        } else if (e.includes('Hoạt động')) {
            this.request.keyword = this.keywords;
            this.request.status = true;
            this.channelService.searchChannel(this.request).subscribe(
                (data) => {
                    this.loading = false;
                    if (data) {
                        this.channel = data.list;
                    }
                },
                (error) => {
                    this.loading = false;
                    this.snackbar.openSnackbar(error, 2000, 'Đóng', 'center', 'bottom', true);
                },
            );
            return;
        } else if (e.includes('Khóa')) {
            this.request.keyword = this.keywords;
            this.request.status = false;
            this.channelService.searchChannel(this.request).subscribe(
                (data) => {
                    this.loading = false;
                    if (data) {
                        this.channel = data.list;
                    }
                },
                (error) => {
                    this.loading = false;
                    this.snackbar.openSnackbar(error, 2000, 'Đóng', 'center', 'bottom', true);
                },
            );
            return;
        }
    }
    // sortByField(key: string) {
    //   let sort = key.split('-');
    //   this.request.sortFeild = sort[0];
    //   this.request.sortValue = sort[1];
    //   if (this.request.sortValue == 'up') this.request.sortValue = true;
    //   if (this.request.sortValue == 'down') this.request.sortValue = false;
    //   this.search(key);
    // }

    filter() {
        this.loading = true;
        this.channelService.getAllChannel(this.request).subscribe(
            (data) => {
                if (data) {
                    this.res = data.list;
                    this.channel = [];
                    this.totalchannels = this.res.length;
                    this.channel = data.list;
                    this.loading = false;
                } else {
                    this.loading = false;
                    this.snackbar.openSnackbar(
                        'Không tìm thấy danh sách kênh',
                        2000,
                        'Đóng',
                        'center',
                        'bottom',
                        false,
                    );
                }
            },
            (error) => {
                this.loading = false;
                this.snackbar.openSnackbar('Không tìm thấy danh sách kênh', 2000, 'Đóng', 'center', 'bottom', false);
            },
        );
    }

    change(id: string) {
        if (this.selectedIds.indexOf(id) < 0) {
            this.selectedIds.push(id);
        } else {
            this.selectedIds.splice(this.selectedIds.indexOf(id), 1);
        }
    }

    DeleteChannels() {
        this.confirmService
            .open('Bạn có chắc chắn muốn xóa những kênh này không ?', ['Có', 'Không'])
            .subscribe((data) => {
                if (data === 'Có') {
                    this.deleteChannelsByIds(this.selectedIds);
                }
            });
    }

    deleteChannelsByIds(selectedIds: string[]) {
        const body = {
            listId: selectedIds,
        };
        // console.log(body);

        let sub = this.channelService.del(body).subscribe(
            (data) => {
                if (data && data.message > 0) {
                    this.snackbar.openSnackbar('Xóa kênh thành công', 2000, 'Đóng', 'center', 'bottom', true);
                    this.filter();
                } else {
                    this.snackbar.openSnackbar('Xóa kênh thất bại', 2000, 'Đóng', 'center', 'bottom', false);
                }
                sub.unsubscribe();
            },
            (error) => {
                this.snackbar.openSnackbar('Xóa kênh thất bại', 2000, 'Đóng', 'center', 'bottom', false);
                sub.unsubscribe();
            },
        );
    }

    listMenuObj = [
        {
            title: 'Trạng thái',
            leftTitleIcon: 'fa-filter',
            listMenuPosition: [
                { title: 'Tất cả', leftIcon: '', value: 'Tất cả' },
                { title: 'Hoạt động', leftIcon: '', value: 'Hoạt động' },
                { title: 'Khóa', leftIcon: '', value: 'Khóa' },
            ],
        },
    ];

    Export() {
        this.confirmService.open('Bạn có muốn xuất tất cả dữ liệu kênh không', ['Có', 'Không']).subscribe((data) => {
            if (data === 'Có') {
                this.channelService.export().subscribe(
                    (data) => {
                        const blob = new Blob([data], {
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        });
                        const url = window.URL.createObjectURL(blob);
                        window.open(url);
                    },
                    (err) => {
                        this.snackbar.failureSnackBar();
                    },
                );
            }
        });
    }
}
