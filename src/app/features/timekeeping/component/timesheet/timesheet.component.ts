import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Config } from 'src/app/core/model/Config';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { Days } from '../../models/Days';
import { TimeSheet } from '../../models/TimeSheet';
import { DateService } from '../../services/date.service';
import { TimeSheetService } from '../../services/time-sheet.service';

@Component({
    selector: 'app-timesheet',
    templateUrl: './timesheet.component.html',
    styleUrls: ['./timesheet.component.scss'],
})
export class TimesheetComponent implements OnInit, AfterViewInit {
    now: any = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);;
    search: boolean = false;
    loading = false;
    hasEmployee = false;
    listGroup: any[] = [];
    timeSheets: TimeSheet[] = [];

    days: Days[] = [];

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
        statusbar: false,
    };

    selectPosition(event: any) {}

    selectStatus(event: any) {}

    selectTimekeeping(event: any) {}

    constructor(
        private datePipe: DatePipe,
        private title: Title,
        public dateService: DateService,
        private employeeService: EmployeeService,
        private timeSheetService: TimeSheetService,
    ) {}

    ngOnInit(): void {
        this.title.setTitle('Báo cáo chấm công tháng');
    }

    ngAfterViewInit(): void {
        // this.employeeService.GetAllGroupByEmployeeId().subscribe((data) => {
        //     if (data) {
        //         this.listGroup = data;
        //     }
        // });
        this.timeSheetService.getEmployee();
        this.timeSheetService.timeSheets$.subscribe((data) => {
            Promise.resolve().then(() => {
                this.timeSheets = data;
            })
        });
        Promise.resolve().then(() => {
            this.now = this.datePipe.transform(this.now, 'yyyy-MM-dd');
        })
        this.dateService.getAllDayOfMonth(this.now);
        this.dateService.allDayOfMonth$.subscribe((data) => {
            Promise.resolve().then(() => {
                this.days = data;
            })
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
        if(!item) return null;
        return index;
    }

    init() {
        if (this.search == false) {
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

    searchUser(event: any) {}
}
