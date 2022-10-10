import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-view-edit-detail-order',
    templateUrl: './view-edit-detail-order.component.html',
    styleUrls: ['./view-edit-detail-order.component.scss'],
})
export class ViewEditDetailOrderComponent implements OnInit {
    type!: string;
    constructor() {}

    ngOnInit(): void {
        this.type = 'View';
    }
}
