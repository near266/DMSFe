import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
    selector: 'field-input',
    templateUrl: './field-input.component.html',
})
export class FieldInput extends FieldType<FieldTypeConfig> {}

@Component({
    selector: 'field-select',
    templateUrl: './field-select.component.html',
})
export class FieldSelect extends FieldType<FieldTypeConfig> {}

export class FieldTextarea extends FieldType<FieldTypeConfig> {}