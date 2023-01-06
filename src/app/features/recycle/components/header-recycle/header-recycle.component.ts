import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-header-recycle',
    templateUrl: './header-recycle.component.html',
    styleUrls: ['./header-recycle.component.scss'],
})
export class HeaderRecycleComponent implements OnInit {
    @Input() title: string = '';
    @Input() totalCount: number = 0;
    @Output() signal = new EventEmitter<string>();
    @Output() keyword = new EventEmitter<string>();

    constructor() {}

    ngOnInit(): void {}

    select(type: string) {
        this.signal.emit(type);
    }

    search(keyword: string) {
        this.keyword.emit(keyword);
    }
}
