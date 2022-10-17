import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { ReturnDetailsService } from '../apis/return-details.service';

@Injectable({
    providedIn: 'root',
})
export class ReturnFormService {
    constructor(private returnDetailsService: ReturnDetailsService) {}
    getOrderDetailsById(id: string) {
        // <--- this method is not used in real cases
        return this.returnDetailsService.getOrderDetailsById(id).pipe(
            map((result) => {
                console.log(result);
                return {
                    ...result,
                    customerId: result.customer?.customerCode || null,
                    orderId: result.orderCode || null,
                    orderEmployeeId: result.orderEmployee?.id || null,
                };
            }),
        );
    }
    getEmployees() {
        return this.returnDetailsService.getEmployees().pipe(
            map((result) => {
                return result.data.map((data: any) => {
                    const { id: value, employeeName, employeeTitle } = data;
                    let label = employeeName;
                    if (employeeTitle) {
                        label = employeeName + ' - ' + employeeTitle;
                    }
                    return { value, label };
                });
            }),
        );
    }

    getGroupsAndFilter() {
        return this.returnDetailsService.getGroups().pipe(
            map((result) => {
                return result.map((data: any) => {
                    const { id: value, name } = data;
                    let label = name;
                    return { value, label };
                });
            }),
        );
    }
}
