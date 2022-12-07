import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SelectOption } from 'src/app/core/model/Select';
import { MenuItem, SelectOptionOutput } from 'src/app/core/shared/modules/side-menu/models/side-menu';

@Component({
    selector: 'app-returns-sidenav',
    templateUrl: './returns-sidenav.component.html',
    styleUrls: ['./returns-sidenav.component.scss'],
})
export class ReturnsSidenavComponent {
    @Input() query: FormControl;
    @Input() menuItems: MenuItem<SelectOption>[] | null;
    @Output() filterChange: EventEmitter<SelectOptionOutput> = new EventEmitter<SelectOptionOutput>();
    select(option: SelectOptionOutput) {
        this.filterChange.emit(option);
    }
}
