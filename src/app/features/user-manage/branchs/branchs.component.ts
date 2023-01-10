import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogService } from 'src/app/core/services/confirmDialog.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Brand } from '../../product/models/product';
import { AddBrandComponent } from './add-brand/add-brand.component';
import { BrandComponent } from './brand/brand.component';
import { BranchService } from './services/branch.service';

@Component({
    selector: 'app-branchs',
    templateUrl: './branchs.component.html',
    styleUrls: ['./branchs.component.scss'],
})
export class BranchsComponent implements OnInit {
    loading = true;
    sideBarWidth!: string;
    type!: string;
    selectedIds: string[] = [];
    brand: Brand[] = [];
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
    totalbranchs: number;
    isLoading: boolean = false;

    constructor(
        public datepipe: DatePipe,
        private dialog: MatDialog,
        private brandService: BranchService,
        private snackbar: SnackbarService,
        private confirmService: ConfirmDialogService,
    ) {}

    ngOnInit(): void {
        this.view();
    }

    view() {
        this.brandService.getAllBrand(this.request).subscribe((data) => {
            if (data) {
                this.brand = data;
                this.totalbranchs = data.length;
                // console.log(data);
            }
        });
    }

    AddBranch() {
        const dialogRef = this.dialog.open(AddBrandComponent, {
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

    open(data: Brand | null = null) {
        const dialogRef = this.dialog.open(BrandComponent, {
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
        this.brandService.searchBrand(this.request).subscribe(
            (data) => {
                this.loading = false;
                if (data) {
                    this.brand = data;
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
            this.brandService.searchBrand(this.request).subscribe(
                (data) => {
                    this.loading = false;
                    if (data) {
                        this.brand = data;
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
            this.brandService.searchBrand(this.request).subscribe(
                (data) => {
                    this.loading = false;
                    if (data) {
                        this.brand = data;
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
            this.brandService.searchBrand(this.request).subscribe(
                (data) => {
                    this.loading = false;
                    if (data) {
                        this.brand = data;
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
    // sortByType(key: string) {
    //   this.request.type = key;
    //   if(this.request.startedDate && this.request.endDate) {
    //     this.search('');
    //   }
    // }
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
        this.brandService.getAllBrand(this.request).subscribe(
            (data) => {
                if (data) {
                    this.res = data;
                    this.brand = [];
                    this.totalbranchs = this.res.length;
                    this.brand = data;
                    this.loading = false;
                } else {
                    this.loading = false;
                    this.snackbar.openSnackbar(
                        'Không tìm thấy danh sách nhãn hiệu',
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
                this.snackbar.openSnackbar(
                    'Không tìm thấy danh sách nhãn hiệu',
                    2000,
                    'Đóng',
                    'center',
                    'bottom',
                    false,
                );
            },
        );
    }

    change(id: any) {
        console.log(id);

        if (this.selectedIds.indexOf(id) < 0) {
            this.selectedIds.push(id);
        } else {
            this.selectedIds.splice(this.selectedIds.indexOf(id), 1);
        }
    }

    DeleteBranchs() {
        this.confirmService
            .open('Bạn có chắc chắn muốn xóa ' + this.selectedIds.length + ' nhãn hiệu không', ['Có', 'Không'])
            .subscribe((data) => {
                if (data === 'Có') {
                    this.deleteBranchsByIds(this.selectedIds);
                }
            });
    }

    deleteBranchsByIds(selectedIds: string[]) {
        const body = {
            id: selectedIds,
        };
        // console.log(body);

        let sub = this.brandService.del(body).subscribe(
            (data) => {
                if (data && data.message > 0) {
                    this.snackbar.openSnackbar('Xóa nhãn hiệu thành công', 2000, 'Đóng', 'center', 'bottom', true);
                    this.filter();
                } else {
                    this.snackbar.openSnackbar('Xóa nhãn hiệu thất bại', 2000, 'Đóng', 'center', 'bottom', false);
                }
                sub.unsubscribe();
            },
            (error) => {
                this.snackbar.openSnackbar('Xóa nhãn hiệu thất bại', 2000, 'Đóng', 'center', 'bottom', false);
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
        this.confirmService
            .open('Bạn có muốn xuất tất cả dữ liệu nhãn hiệu tính không', ['Có', 'Không'])
            .subscribe((data) => {
                if (data === 'Có') {
                    this.isLoading = true;
                    this.brandService.export().subscribe(
                        (data) => {
                            const blob = new Blob([data], {
                                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            });
                            const url = window.URL.createObjectURL(blob);
                            window.open(url);
                            this.isLoading = false;
                        },
                        (err) => {
                            this.snackbar.failureSnackBar();
                        },
                    );
                }
            });
    }
}
