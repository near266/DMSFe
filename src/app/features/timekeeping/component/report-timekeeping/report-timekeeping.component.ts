import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Config } from 'src/app/core/model/Config';
import { Days } from '../../models/Days';
import { DateService } from '../../services/date.service';

@Component({
    selector: 'app-report-timekeeping',
    templateUrl: './report-timekeeping.component.html',
    styleUrls: ['./report-timekeeping.component.scss'],
})
export class ReportTimekeepingComponent implements OnInit, AfterViewInit {
    now: any = Date.now();
    loading = true;
    hasEmployee = false;
    days: Days[] = [];

    class = {
        left: 'w-5',
        right: 'w-full',
        statusbar: false,
    };

    positionMenu: Config = {
        icon: '<i class="fa-solid fa-filter"></i>',
        title: 'Lọc theo chức danh',
        menuChildrens: ['Tất cả', 'Nhân viên', 'Kế toán', 'Giám sát', 'Chủ sở hữu'],
    };

    selectPosition(event: any) {}

    constructor(private datePipe: DatePipe, private title: Title, private dateService: DateService) {}

    ngOnInit(): void {
        this.title.setTitle('Báo cáo chấm công tháng');
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
        return item.date;
    }

    searchUser(event: any) {}

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
}
