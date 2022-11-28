import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectOption } from 'src/app/core/model/Select';
import { MenuItemData } from '../../models/side-menu';

@Component({
    selector: 'app-side-menu-select',
    templateUrl: './side-menu-select.component.html',
    styleUrls: ['./side-menu-select.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuSelectComponent {
    @Input() data: MenuItemData<SelectOption> | null;
    @Input() activeOption: SelectOption | null;
    @Output() selectOption: EventEmitter<SelectOption | null> = new EventEmitter();

    select(option: SelectOption): void {
        //check if option is selected
        if (this.activeOption?.value === option.value) {
            this.selectOption.emit(null);
        } else {
            this.selectOption.emit(option);
        }
    }
}
