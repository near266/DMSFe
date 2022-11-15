import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
@Component({
    selector: 'order-template-table',
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
    @Output() listIdsSelected$: EventEmitter<string[]> = new EventEmitter<string[]>();

    pageSize: number = 30;
    id: string[] = [];
    constructor() {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {}

    emit(value: any) {
        this.emitValue$.emit(value);
    }

    chooseID(event: any, id: any, order: any) {
        if (event.checked == true) {
            this.id.push(id);
            order.checked = true;
        } else {
            this.id.splice(this.id.indexOf(id), 1);
        }
        this.emitlistIdsSelected();
    }

    chooseAll(e: any) {
        if (e.checked) {
            this.listData.forEach((order: any) => {
                // push vào id array khi chưa được chọn trước đó
                if (!order.checked) {
                    this.id.push(order.id);
                }
                order.checked = true;
            });
        } else {
            this.listData.forEach((order: any) => {
                order.checked = false;
                this.id.splice(this.id.indexOf(order.id), 1);
            });
        }
        this.emitlistIdsSelected();
    }

    emitlistIdsSelected() {
        this.listIdsSelected$.emit(this.id);
    }
}
