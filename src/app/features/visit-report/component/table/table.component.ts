import { Component, OnInit } from '@angular/core';
import { Headers } from '../../model/header';

@Component({
    selector: 'visit-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
    headers = Headers;
    data: any = [
        {
            employeeName: 'NV1',
            timkeepingList: [
                {
                    time: 'TimeKeeping 1',
                    checkinList: [
                        {
                            address: 'Adress 11',
                        },
                        {
                            address: 'Adress 12',
                        },
                        {
                            address: 'Adress 13',
                        },
                        {
                            address: 'Adress 14',
                        },
                    ],
                },
                {
                    time: 'TimeKeeping 2',
                    checkinList: [
                        {
                            address: 'Adress 21',
                        },
                        {
                            address: 'Adress 22',
                        },
                        {
                            address: 'Adress 23',
                        },
                        {
                            address: 'Adress 23',
                        },
                    ],
                },
            ],
        },
        {
            employeeName: 'NV2',
            timkeepingList: [
                {
                    time: 'TimeKeeping 1',
                    checkinList: [
                        {
                            address: 'Adress 11',
                        },
                        {
                            address: 'Adress 12',
                        },
                        {
                            address: 'Adress 13',
                        },
                        {
                            address: 'Adress 14',
                        },
                    ],
                },
                {
                    time: 'TimeKeeping 2',
                    checkinList: [
                        {
                            address: 'Adress 21',
                        },
                        {
                            address: 'Adress 22',
                        },
                        {
                            address: 'Adress 23',
                        },
                        {
                            address: 'Adress 23',
                        },
                    ],
                },
            ],
        },
    ];
    constructor() {}

    ngOnInit(): void {}
}
