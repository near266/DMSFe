import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { ReportService } from 'src/app/core/services/report.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { IBody } from '../models/IBody';
import { List, MaxList, MinList, Response } from '../models/List';
import { TimeSheet } from '../models/TimeSheet';

@Injectable({
    providedIn: 'root',
})
export class TimeSheetService {
    private readonly defaultTimeSheet: TimeSheet[] = [];
    private readonly defaultList: List[] = [];

    private timeSheets: BehaviorSubject<TimeSheet[]> = new BehaviorSubject<TimeSheet[]>(this.defaultTimeSheet);
    private listTimeSheet: BehaviorSubject<List[]> = new BehaviorSubject<List[]>(this.defaultList);

    public timeSheets$ = this.timeSheets.asObservable();
    public list$ = this.listTimeSheet.asObservable();

    constructor(
        private employeeService: EmployeeService,
        public snackbar: SnackbarService,
        private report: ReportService,
    ) {}

    getEmployee() {
        this.employeeService.GetAllByEmployeeId().subscribe(
            (data: TimeSheet[]) => {
                if (data) {
                    this.timeSheets.next(data);
                } else {
                    this.snackbar.openSnackbar(
                        'Không thể tải danh sách chấm công',
                        2000,
                        'Đóng',
                        'center',
                        'bottom',
                        false,
                    );
                }
            },
            (error) => {
                this.snackbar.openSnackbar(
                    'Không thể tải danh sách chấm công',
                    2000,
                    'Đóng',
                    'center',
                    'bottom',
                    false,
                );
            },
        );
    }

    getList(body: IBody) {
        this.report.TimeKeepingReport(body).subscribe(
            (response: Response) => {
                if (response) {
                    response.list.forEach((element) => {
                        element.listData.forEach((data) => {
                            let maxList: MaxList[] = new Array(31);
                            data.listTime[0].maxList?.forEach((max) => {
                                maxList[new Date(max.timeKeepingDate).getDate()] = max;
                            });
                            data.listTime[0].maxList = maxList;
                            let minList: MinList[] = new Array(31);
                            data.listTime[0].minList?.forEach((min) => {
                                minList[new Date(min.timeKeepingDate).getDate()] = min;
                            });
                            data.listTime[0].minList = minList;
                        });
                    });
                    console.log(response.list);

                    this.listTimeSheet.next(response.list);
                } else {
                    this.snackbar.openSnackbar(
                        'Không thể tải danh sách chấm công',
                        2000,
                        'Đóng',
                        'center',
                        'bottom',
                        false,
                    );
                }
            },
            (error) => {
                this.snackbar.openSnackbar(
                    'Không thể tải danh sách chấm công',
                    2000,
                    'Đóng',
                    'center',
                    'bottom',
                    false,
                );
            },
        );
    }
}
