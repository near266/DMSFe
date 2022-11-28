import { defaultMenuItems, MenuItem, SelectOptionOutput } from './models/side-menu';
import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { MenuItemType } from './models/side-menu';
import { SelectOption } from 'src/app/core/model/Select';

@Component({
    selector: 'app-side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent {
    @Input() menuItems: MenuItem<SelectOption>[] = defaultMenuItems;
    @Output() filterChange: EventEmitter<SelectOptionOutput> = new EventEmitter();
    handleOptionChange($event: SelectOptionOutput) {
        this.filterChange.emit($event);
    }
}
