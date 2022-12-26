import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { TimeSheet } from '../models/TimeSheet';

@Injectable({
    providedIn: 'root',
})
export class TimeSheetService {
    private readonly defaultTimeSheet: TimeSheet[] = [];

    private timeSheets: BehaviorSubject<TimeSheet[]> = new BehaviorSubject<TimeSheet[]>(this.defaultTimeSheet);

    public timeSheets$ = this.timeSheets.asObservable();

    constructor(private employeeService: EmployeeService, public snackbar: SnackbarService) {}

    getEmployee() {
        this.employeeService.GetAllGroupByEmployeeId().subscribe(
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
}
