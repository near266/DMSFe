import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-template-sidebar',
    templateUrl: './template-sidebar.component.html',
    styleUrls: ['./template-sidebar.component.scss'],
})
export class TemplateSidebarComponent implements OnInit {
    @Output() showSidebar$ = new EventEmitter<boolean>();
    constructor() {}

    ngOnInit(): void {}
    showSidebar() {
        this.showSidebar$.emit(true);
    }
}
