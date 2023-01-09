import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Config } from 'src/app/core/model/Config';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { Days } from '../../models/Days';
import { IBody } from '../../models/IBody';
import { List } from '../../models/List';
import { TimeSheet } from '../../models/TimeSheet';
import { DateService } from '../../services/date.service';
import { TimeSheetService } from '../../services/time-sheet.service';

@Component({
    selector: 'app-timesheet',
    templateUrl: './timesheet.component.html',
    styleUrls: ['./timesheet.component.scss'],
})
export class TimesheetComponent implements OnInit, AfterViewInit {
    now: any = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    search: boolean = false;
    loading = false;
    hasEmployee = false;
    listGroup: any[] = [];
    timeSheets: TimeSheet[] = [];
    list: List[] = [];
    totalCount: number = 0;

    days: Days[] = [];

    body: IBody = {
        from: this.datePipe.transform(new Date().setDate(1), 'yyyy-MM-dd') + 'T00:00:00.000Z',
        to: this.datePipe.transform(this.now, 'yyyy-MM-dd') + 'T23:59:59.999Z',
        page: 1,
        pageSize: 3,
    };

    positionMenu: Config = {
        icon: '<i class="fa-solid fa-filter"></i>',
        title: 'Lọc theo chức danh ',
        menuChildrens: ['Tất cả', 'Nhân viên', 'Kế toán', 'Giám sát', 'Chủ sở hữu'],
    };

    statusMenu: Config = {
        icon: '<i class="fa-solid fa-filter"></i>',
        title: 'Trạng thái nhân viên',
        menuChildrens: ['Tất cả', 'Hoạt động', 'Không hoạt động'],
    };

    timekeepingMenu: Config = {
        icon: '<i class="fa-solid fa-filter"></i>',
        title: 'Chấm công hôm nay',
        menuChildrens: ['Tất cả', 'Đã chấm công'],
    };

    class = {
        left: 'w-2/12',
        right: 'w-10/12',
        statusbar: true,
    };

    selectPosition(event: any) {}

    selectStatus(event: any) {}

    selectTimekeeping(event: any) {}

    constructor(
        public datePipe: DatePipe,
        private title: Title,
        public dateService: DateService,
        public timeSheetService: TimeSheetService,
    ) {}

    ngOnInit(): void {
        this.title.setTitle('Báo cáo chấm công');
        this.timeSheetService.loading$.subscribe((data) => {
            Promise.resolve().then(() => {
                this.loading = data;
            });
        });
    }

    ngAfterViewInit(): void {
        Promise.resolve().then(() => {
            this.now = this.datePipe.transform(this.now, 'yyyy-MM-dd');
        });
        this.dateService.getAllDayOfMonth(this.now);
        this.dateService.allDayOfMonth$.subscribe((data) => {
            Promise.resolve().then(() => {
                this.days = data;
            });
        });
    }

    show() {
        this.timeSheetService.getList(this.body);
        this.timeSheetService.list$.subscribe((data) => {
            Promise.resolve().then(() => {
                this.list = data;
            });
        });
        this.timeSheetService.totalCount$.subscribe((data) => {
            Promise.resolve().then(() => {
                this.totalCount = data;
            });
        });
    }

    openSideBar() {
        this.class = {
            left: 'w-2/12',
            right: 'w-10/12',
            statusbar: true,
        };
    }

    closeSideBar() {
        this.class = {
            left: 'w-5',
            right: 'w-full',
            statusbar: false,
        };
    }

    trackByFn(index: number, item: any) {
        if (!item) return null;
        return index;
    }

    init() {
        if (this.search == false) {
            this.show();
            this.search = true;
        }
    }

    initDays() {
        let temp = new Date(this.now);
        let count: number = temp.getDate();
        for (let i = count - 1; i >= 0; i--) {
            this.days.push({
                date: count - i,
                day: this.dateService.getDay(count - i, temp.getMonth(), temp.getFullYear()),
            });
        }
    }

    searchUser(event: any) {
        let arrays: any[] = event.split(',');
        if (arrays[1] == 'root') {
            this.body.groupId = null;
            this.body.employeeId = null;
        } else {
            if (arrays[0] == '2') {
                this.body.employeeId = [arrays[1]];
                this.body.groupId = null;
            } else {
                this.body.groupId = [arrays[1]];
                this.body.employeeId = null;
            }
        }
        this.body.page = 1;
        this.show();
    }

    selectedDate() {
        this.body.to = this.now + 'T23:59:59.999Z';
        this.body.from = this.dateService.ReturnDayStart(this.now) + 'T00:00:00.000Z';
        this.body.page = 1;
        this.show();
    }
    handlePageChange(event: any) {
        this.body.page = event;
        this.show();
    }
}
