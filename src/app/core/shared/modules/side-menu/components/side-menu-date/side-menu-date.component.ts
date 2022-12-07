import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import * as moment from 'moment';
import { SelectOption } from 'src/app/core/model/Select';

@Component({
    selector: 'app-side-menu-date',
    templateUrl: './side-menu-date.component.html',
    styleUrls: ['./side-menu-date.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuDateComponent {
    @Input() activeOption: SelectOption | null;
    @Output() selectOption: EventEmitter<SelectOption> = new EventEmitter();

    select(value: Date) {
        this.selectOption.emit({ label: moment(value).format('DD/MM/YYYY'), value: value.toString() });
    }
}
