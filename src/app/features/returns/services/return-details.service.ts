import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { ReturnApiService } from '../apis/return-api.service';
import { ComponentMode } from '../models/componentMode';
import { Return } from '../models/return';

@Injectable({
    providedIn: 'root',
})
export class ReturnDetailsService {
    returnDetails$: BehaviorSubject<Return> = new BehaviorSubject<Return>({});
    returnListProducts$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    currentMode$: BehaviorSubject<ComponentMode> = new BehaviorSubject<ComponentMode>(ComponentMode.VIEW);
    totalPrice$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    discountAmount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    constructor(private returnApiService: ReturnApiService) {}
    getReturnById(id: string | null) {
        return this.returnApiService.getReturnById(id).pipe(
            tap((data) => {
                data.groupId = data.group?.id;
                data.orderEmployeeId = data.orderEmployee?.id;
                data.customerCode = {
                    value: data.customer?.id || null,
                };
                this.returnDetails$.next(data);
                this.returnListProducts$.next(data.listProduct);
            }),
        );
    }
}
