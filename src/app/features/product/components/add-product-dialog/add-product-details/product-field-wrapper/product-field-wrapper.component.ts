import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
    selector: 'app-product-field-wrapper',
    templateUrl: './product-field-wrapper.component.html',
    styleUrls: ['./product-field-wrapper.component.scss'],
})
export class ProductFieldWrapper extends FieldWrapper {}
