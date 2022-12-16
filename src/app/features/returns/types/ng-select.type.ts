import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

@Component({
    templateUrl: 'ng-select.component.html',
    styleUrls: ['./ng-select.component.scss'],
})
export class NgSelectFormlyComponent extends FieldType {
    get control() {
        return this.formControl as FormControl;
    }
}
