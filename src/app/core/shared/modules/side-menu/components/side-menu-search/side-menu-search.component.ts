import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { SelectOption } from 'src/app/core/model/Select';
import { MenuItemData } from '../../models/side-menu';

@Component({
    selector: 'app-side-menu-search',
    templateUrl: './side-menu-search.component.html',
    styleUrls: ['./side-menu-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuSearchComponent implements OnInit {
    @Input() data: MenuItemData<SelectOption> | null;
    @Input() activeOption: SelectOption | null;
    @Output() selectOption: EventEmitter<SelectOption | null> = new EventEmitter();

    constructor() {}

    ngOnInit(): void {}

    select(option: SelectOption) {
        if (this.activeOption?.value === option.value) {
            this.selectOption.emit(null);
        } else {
            this.selectOption.emit(option);
        }
    }
}
