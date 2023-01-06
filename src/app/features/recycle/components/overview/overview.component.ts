import { Component, OnInit, AfterViewInit, DoCheck, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit, AfterViewInit, DoCheck, OnChanges, OnDestroy {
    constructor(private title: Title) {}

    ngOnInit(): void {
        this.title.setTitle('Thùng rác');
    }
    ngAfterViewInit(): void {}
    ngOnChanges(changes: SimpleChanges): void {}
    ngDoCheck(): void {}
    ngOnDestroy(): void {}
}
