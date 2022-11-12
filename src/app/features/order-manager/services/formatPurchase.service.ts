import { CurrencyPipe, DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { purchaseConfigData } from '../models/config';
import { PurchaseOrder } from '../models/purchases';

@Injectable({
    providedIn: 'root',
})
export class FormatPurchaseService {
    constructor(private datepipe: DatePipe, private currency: CurrencyPipe) {}
    // format ở bảng purchases
    formatPurchases(data: PurchaseOrder[]) {
        let result = data.map((order: PurchaseOrder) => {
            return [
                // Người đặt
                {
                    content: order.orderEmployee?.employeeName,
                },
                // Trạng thái
                {
                    content: order.status,
                    isStatusCol: true,
                },
                // Mã phiếu
                {
                    content: order.orderCode,
                    isEmit: true,
                    emitValue: order.id,
                    children: [
                        {
                            title: 'Tổng số lần bán hàng',
                            class: 'fa-solid fa-calculator px-1 py-0.5 border rounded-sm text-sm',
                            total: null,
                        },
                        {
                            title: 'Tổng số lần xuất hàng',
                            class: 'fa-solid fa-gears px-1 py-0.5 border rounded-sm text-sm',
                            total: null,
                        },
                        {
                            title: 'Tổng số lần chuyển kho',
                            class: 'fa-solid fa-truck-fast px-1 py-0.5 border rounded-sm text-sm',
                            total: null,
                        },
                        {
                            title: 'Tổng số lần trả hàng',
                            class: 'fa-solid fa-repeat px-1 py-0.5 border rounded-sm text-sm',
                            total: null,
                        },
                        {
                            title: 'Trao đổi (Ghi chú)',
                            class: 'fa-solid fa-comment px-1 py-0.5 border rounded-sm text-sm',

                            total: null,
                        },
                        {
                            title: 'Số lần in',
                            class: 'fa-solid fa-print px-1 py-0.5 border rounded-sm text-sm flex items-center',
                            total: order.printStatus,
                        },
                    ],
                },
                // Mã KH
                {
                    content: order.customer?.customerCode,
                },
                // Tên KH
                {
                    content: order.customer?.customerName,
                },
                // Địa chỉ
                {
                    content: order.customer?.address,
                },
                // Ngày đặt
                {
                    content: this.datepipe.transform(order.orderDate, 'dd/MM/yyyy'),
                },
                // Tổng tiền
                {
                    content: this.currency.transform(order.totalPayment, 'VND', 'symbol'),
                },
                // Người duyệt
                {
                    content: order.approved?.employeeName,
                },
                // Ngày duyệt
                {
                    content: this.datepipe.transform(order.approvedDate, 'dd/MM/yyyy'),
                },
                // Nguồn
                {
                    content: order.source,
                },
                // Ngày tạo
                {
                    content: this.datepipe.transform(order.createdDate, 'dd/MM/yyyy'),
                },
                // Người tạo
                {
                    content: order.createdBy,
                },
                // Ngày sửa
                {
                    content: this.datepipe.transform(order.lastModifiedDate, 'dd/MM/yyyy'),
                },
                // Người sửa
                {
                    content: order.lastModifiedBy,
                },
                // Diễn giải
                {
                    content: order.description,
                },
            ];
        });
        return result;
    }
}
