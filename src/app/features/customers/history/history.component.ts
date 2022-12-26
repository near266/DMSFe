import { Component, OnInit } from '@angular/core';
import { CRow } from 'src/app/core/shared/components/template-table-normal/template-table-normal.component';

@Component({
    selector: 'customer-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
    headers = [
        'Trạng thái',
        'Mã KH',
        'Loại KH',
        'Nhóm KH',
        'Khu vực',
        'Kênh',
        'SĐT',
        'Email',
        'Địa chỉ',
        'Ảnh',
        'Vĩ độ',
        'Kinh độ',
    ];
    rows: CRow[] = [
        {
            colspan: 6,
            listCol: ['1', '2'],
        },
        {
            listCol: [
                'Ifing for random paragraphs, you word or a random sentence  quite enough, the next logical step is to find a random paragraph',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
                '10',
                '11',
                '12',
            ],
        },
    ];
    constructor() {}

    ngOnInit(): void {}
}
