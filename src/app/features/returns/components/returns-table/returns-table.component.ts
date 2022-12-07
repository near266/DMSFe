import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Return, Status } from '../../models/return';
import { Pagination } from '../../models/settings';
import { tableHeader } from '../../models/table.header';
import { ReturnsService } from '../../services/returns.service';

@Component({
    selector: 'app-returns-table',
    templateUrl: './returns-table.component.html',
    styleUrls: ['./returns-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnsTableComponent {
    @Input() returns$: Observable<Return[]>;
    @Input() totalItems$: Observable<number>;
    @Input() pagination$: Observable<Pagination>;
    @Input() loading$: Observable<boolean>;
    Status = Status;
    headers = tableHeader;
}
