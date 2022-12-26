import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';
import { debounceTime, distinctUntilChanged, map, Observable, startWith, switchMap } from 'rxjs';

@Component({
    templateUrl: 'ng-search.component.html',
    styleUrls: ['./ng-search.component.scss'],
})
export class NgSearchComponent extends FieldType {
    get control() {
        return this.formControl as FormControl;
    }
    filter$: Observable<any>;
    ngOnInit() {
        this.filter$ = this.control.valueChanges.pipe(
            distinctUntilChanged(),
            debounceTime(200),
            startWith(''),
            map((value) => (typeof value === 'string' ? value : value.label)),
            switchMap((query: string) => {
                return this.props['search'](query);
            }),
        );
    }
    displayFn(value: any) {
        if (value) {
            console.log(value.value);
            return value && typeof value === 'object' ? value.customerCode : value;
        }
    }
}
