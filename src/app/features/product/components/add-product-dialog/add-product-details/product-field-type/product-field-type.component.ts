import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
    selector: 'product-field-input',
    templateUrl: './product-field-input.component.html',
})
export class ProductFieldInput extends FieldType<FieldTypeConfig> {}

@Component({
    selector: 'product-field-select',
    templateUrl: './product-field-select.component.html',
})
export class ProductFieldSelect extends FieldType<FieldTypeConfig> {}
