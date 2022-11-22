import { CurrencyPipe, DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { SaleOrder } from '../models/sale';

@Injectable({
    providedIn: 'root',
})
export class FormatSaleService {
    constructor(private datepipe: DatePipe, private currency: CurrencyPipe) {}
    formatData(data: SaleOrder[]) {
        let result = data.map((order: SaleOrder, index: number) => {
            return {
                id: order.id,
                checked: false,
                array: [
                    {
                        content: index,
                    },
                    {
                        isCheckbox: true,
                        checkboxValue: order.id,
                    },
                    // Người bán
                    {
                        content: order.orderEmployee?.employeeName,
                    },
                    // Người bán
                    {
                        content: order.saleEmployee?.employeeName,
                    },
                    // Trạng thái
                    {
                        content: order.status,
                        isStatusCol: true,
                    },
                    // Mã phiếu
                    {
                        content: order.saleCode,
                        isEmit: true,
                        emitValue: order.id,
                        children: [
                            // {
                            //     title: 'Tổng số lần xuất hàng',
                            //     class: 'fa-solid fa-gears px-1 py-0.5 border rounded-sm text-sm',
                            //     total: null,
                            // },
                            // {
                            //     title: 'Tổng số lần trả hàng',
                            //     class: 'fa-solid fa-repeat px-1 py-0.5 border rounded-sm text-sm',
                            //     total: null,
                            // },
                            // {
                            //     title: 'Trao đổi (Ghi chú)',
                            //     class: 'fa-solid fa-comment px-1 py-0.5 border rounded-sm text-sm',
                            //     total: null,
                            // },
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
                    // Ngày bán
                    {
                        content: this.datepipe.transform(order.saleDate, 'dd/MM/yyyy'),
                    },
                    // Tổng tiền
                    {
                        content: this.currency.transform(order.totalPayment, 'VND', 'symbol'),
                    },
                    // Ngày tạo
                    {
                        content: this.datepipe.transform(order.createdDate, 'dd/MM/yyyy'),
                    },
                    // Người tạo
                    {
                        content: order.createdBy,
                    },
                    // Ngày chỉnh sửa
                    {
                        content: this.datepipe.transform(order.lastModifiedDate, 'dd/MM/yyyy'),
                    },
                    // Người chỉnh sửa
                    {
                        content: order.lastModifiedBy,
                    },
                    // Diễn giải
                    {
                        content: order.description,
                    },
                ],
            };
        });
        return result;
    }
}
