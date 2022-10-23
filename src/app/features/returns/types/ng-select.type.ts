import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';

@Component({
    selector: 'formly-ng-select',
    templateUrl: 'ng-select.component.html',
    styleUrls: ['./ng-select.component.scss'],
})
export class NgSelectFormlyComponent extends FieldType {}
