import { Injectable, QueryList } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TemplateInforOrderComponent } from '../template-component/template-infor-order/template-infor-order.component';
import { TemplateTableProductComponent } from '../template-component/template-table-product/template-table-product.component';

@Injectable({
    providedIn: 'root',
})
export class ValidateService {
    constructor() {}

    validatePurchase(
        templateInforOrder: TemplateInforOrderComponent,
        templateTableProducts: QueryList<TemplateTableProductComponent>,
    ): Validate {
        let isEmptyQuantity: boolean = false;
        templateTableProducts.forEach((templateTableProduct: TemplateTableProductComponent) => {
            templateTableProduct.listAdd.forEach((product: any) => {
                if (product.quantity === 0) {
                    isEmptyQuantity = true;
                }
            });
            templateTableProduct.list.forEach((product: any) => {
                if (product.quantity === 0) {
                    isEmptyQuantity = true;
                }
            });
        });
        let Form: FormGroup = templateInforOrder.form;
        let validate: Validate = new Validate();
        if (Form.get('orderEmployeeId')!.invalid) {
            validate.noteList.push('Nhân viên đặt là bắt buộc');
        }
        if (Form.get('customerId')!.invalid) {
            validate.noteList.push('Khách hàng là bắt buộc');
        }
        if (isEmptyQuantity) {
            validate.noteList.push('Số lượng sản phẩm phải lớn hơn 0');
        }
        validate.isValid = Form.get('orderEmployeeId')!.valid && Form.get('customerId')!.valid && !isEmptyQuantity;
        return validate;
    }

    validateSale(
        templateInforOrder: TemplateInforOrderComponent,
        templateTableProducts: QueryList<TemplateTableProductComponent>,
    ): Validate {
        let validate: Validate = this.validatePurchase(templateInforOrder, templateTableProducts);
        let Form: FormGroup = templateInforOrder.form;
        if (Form.get('saleEmployee')!.invalid) {
            validate.noteList.push('Nhân viên bán là bắc buộc');
        }
        return validate;
    }
}

export class Validate {
    isValid: boolean;
    noteList: string[] = [];
}
