import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
@Component({
    selector: 'app-template-table',
    templateUrl: './template-table.component.html',
    styleUrls: ['./template-table.component.scss'],
})
export class TemplateTableComponent implements OnInit, OnChanges {
    @Input() isLoading: boolean = true;
    @Input() headers: string[] = [];
    @Input() page: number = 1;
    @Input() total: number = 0;
    @Input() listData: any = [];
    @Output() emitValue$: EventEmitter<string> = new EventEmitter<string>();

    pageSize: number = 30;
    constructor() {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {
        console.log(this.listData);
    }

    emit(value: any) {
        this.emitValue$.emit(value);
    }
}
