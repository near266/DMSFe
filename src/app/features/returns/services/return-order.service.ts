import { OrderEmployee } from './../../../core/model/PurchaseOrder';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import * as moment from 'moment';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { SaleReceiptService } from 'src/app/core/services/saleReceipt.service';

@Injectable({
    providedIn: 'root',
})
export class ReturnOrderService {
    returnInfo$: BehaviorSubject<any> = new BehaviorSubject<any>({});
    returnProductList$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    returnPromotionList$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    returnStatusInfo$: BehaviorSubject<any> = new BehaviorSubject<any>({});
    totalPrice$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    discountAmount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    submitFormInfo$: Subject<boolean> = new Subject<boolean>();
    submitFormProductList$: Subject<any[]> = new Subject<any[]>();
    submitFormPromotionList$: Subject<any> = new Subject<any>();

    constructor(private snackbar: SnackbarService, private saleReceiptService: SaleReceiptService) {}
    formatUpdateStatusOrder(info: any) {
        const details = {
            id: info?.id || null,
            purchaseOrderId: info?.purchaseOrder?.id || null,
            orderDate: moment(info?.orderDate).format('YYYY-MM-DD') || null,
            groupId: info.group?.id,
            orderEmployeeId: info?.orderEmployee?.id || null,
            saleEmployeeId: info?.saleEmployee?.id || null,
            warehouseId: info?.warehouse?.id || null,
            customerId: info?.customer?.id || null,
            routeId: info?.route?.id || null,
            type: info?.type || 0,
            status: 6,
            paymentMethod: info?.paymentMethod || 0,
            saleDate: moment(info?.saleDate).format('YYYY-MM-DD') || null,
            description: info?.description || null,
            paymentTerm: moment(info?.paymentTerm).format('YYYY-MM-DD') || null,
            debtRecord: info?.debtRecord || false,
            saleCode: info?.saleCode || null,
            phone: info?.phone || null,
            address: info?.address || null,
            customerName: info?.customerName || null,
            totalAmount: info?.totalAmount || 0,
            totalOfVAT: info?.totalOfVAT || 0,
            totalDiscountProduct: info?.totalDiscountProduct || 0,
            tradeDiscount: info?.tradeDiscount || 0,
            totalPayment: info?.totalPayment || 0,
            archived: false,
            deliveryDate: moment(info?.deliveryDate).format('YYYY-MM-DD') || null,
            lastModifiedDate: moment(Date.now()).format('YYYY-MM-DD'),
            prePayment: info?.prePayment || 0,
            // orderCode: info?.orderCode || 0 ,
        };

        return details;
    }

    updatePurchaseOrderStatus(status: number) {
        const body = this.returnStatusInfo$.getValue();
        this.saleReceiptService.update(body).subscribe({
            next: (data) => {
                console.log('oke');
                this.returnInfo$.next({});
                this.returnProductList$.next([]);
                this.returnPromotionList$.next([]);
                this.totalPrice$.next(0);
                this.discountAmount$.next(0);
            },
            error: (err) => {
                this.snackbar.openSnackbar('Có lỗi xảy ra', 2000, 'Đóng', 'center', 'bottom', false);
            },
        });
    }
    formatSubmitListProduct(list: any[]) {
        return list.map((item) => {
            return {
                productId: item?.productId || null,
                unitId: item?.unitId || null,
                warehouseId: item?.warehouseId || null,
                unitPrice: item?.unitPrice || 0,
                quantity: item?.quantity || 0,
                totalPrice: item?.totalPrice || 0,
                discount: item?.discount || 0,
                discountRate: item?.discountRate || 0,
                returnsQuantity: item?.returnsQuantity || 0,
                salesQuantity: item?.salesQuantity || 0,
                exportQuantity: 0,
                type: item?.type || 1,
                note: item?.note || null,
            };
        });
    }
    formatListProduct(listProduct: any[]) {
        console.log(listProduct);
        return listProduct.map((item) => {
            return {
                product: item.product,
                unit: item.unit,
                warehouse: item.warehouse,
                productId: item.product.id,
                unitId: item?.unit?.id || null,
                warehouseId: item?.warehouse?.id || null,
                unitPrice: item?.unitPrice || 0,
                quantity: item?.quantity || 0,
                totalPrice: item?.totalPrice || 0,
                discount: item?.discount || 0,
                discountRate: item?.discountRate / 100 || 0,
                returnsQuantity: item?.quantity || 0,
                salesQuantity: item?.quantity || 0,
                exportQuantity: 0,
                vat: item?.product?.vat || 0,
                type: item?.type || 1,
                note: item?.note || null,
            };
        });
    }
    formatInfo(info: any) {
        console.log(info);
        return {
            saleCode: info?.saleCode || null,
            saleRecieptId: info?.id || null,
            customerId: info.customer?.id || null,
            customerName: info.customer?.customerName || null,
            groupId: info.group?.id,
            orderEmployeeId: info.orderEmployee?.id || null,
            orderDate: info?.orderDate || null,
            phone: info?.phone || null,
            address: info?.address || null,
            description: 'Trả hàng theo phiếu đặt hàng số [' + info?.saleCode + ']',
            customerCode: info.customer?.customerCode || null,
            orderEmployeeName: info.orderEmployee?.employeeName || null,
            groupName: info.group?.name,
        };
    }
}
