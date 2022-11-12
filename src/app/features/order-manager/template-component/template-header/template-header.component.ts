import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';

export class DateFilter {
    fromDate: string | null;
    toDate: string | null;
}

@Component({
    selector: 'app-template-header',
    templateUrl: './template-header.component.html',
    styleUrls: ['./template-header.component.scss'],
})
export class TemplateHeaderComponent implements OnInit {
    @Input() titleHeader: string = '';
    @Input() total: number = 0;
    @Input() quantitySelected: number = 0;
    @Output() dateFilter$ = new EventEmitter<DateFilter>();

    dateSearchForm: FormGroup;
    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        // create dateSearchForm
        this.dateSearchForm = this.fb.group({
            fromDate: [null],
            toDate: [null],
        });
    }

    clearDatePicker() {
        this.dateSearchForm.setValue({
            fromDate: null,
            toDate: null,
        });
    }

    emitFromAndEndDate() {
        this.dateFilter$.emit(this.getFromAndEndDateEmit());
    }

    getFromAndEndDateEmit() {
        let fromDate: string | null = null;
        let toDate: string | null = null;
        if (this.dateSearchForm.get('fromDate')?.value) {
            fromDate = moment(this.dateSearchForm.get('fromDate')?.value).format('YYYY-MM-DD');
        }
        if (this.dateSearchForm.get('toDate')?.value) {
            toDate = moment(this.dateSearchForm.get('toDate')?.value).format('YYYY-MM-DD');
        }
        return {
            fromDate: fromDate,
            toDate: toDate,
        };
    }
}
