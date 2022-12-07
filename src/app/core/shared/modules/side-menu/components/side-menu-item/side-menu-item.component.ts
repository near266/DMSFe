import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectOption } from 'src/app/core/model/Select';
import { MenuItem, MenuItemType, SelectOptionOutput } from '../../models/side-menu';

@Component({
    selector: 'app-side-menu-item',
    templateUrl: './side-menu-item.component.html',
    styleUrls: ['./side-menu-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuItemComponent {
    @Input() menuItem: MenuItem<SelectOption>;
    @Output() optionChange: EventEmitter<SelectOptionOutput> = new EventEmitter();
    MenuItemType = MenuItemType;
    expanded = false;
    cancelSelect($event: Event) {
        $event.stopPropagation();
        this.select(null);
    }
    select(value: SelectOption | null): void {
        this.expanded = false;
        if (value) {
            this.optionChange.emit({ ...value, filterType: this.menuItem.filterType });
        } else {
            this.optionChange.emit({ label: null, value: null, filterType: this.menuItem.filterType });
        }
    }
    toggleExpand() {
        this.expanded = !this.expanded;
    }
}
