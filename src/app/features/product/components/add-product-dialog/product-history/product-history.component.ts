import { CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CRow } from 'src/app/core/shared/components/template-table-normal/template-table-normal.component';
import { ProductApiService } from '../../../apis/product.api.service';
import { ProductHistory } from '../../../models/productHistory';

@Component({
    selector: 'app-product-history',
    templateUrl: './product-history.component.html',
    styleUrls: ['./product-history.component.scss'],
})
export class ProductHistoryComponent implements OnInit, OnDestroy {
    @Input() productId?: string = '';
    headers = ['Mã sản phẩm', 'Tên sản phẩm', 'VAT', 'ĐVT', 'ĐVT Lẻ', 'HSQĐ', 'Giá', 'Giá lẻ'];
    rows: CRow[] = [];
    subscriptions: Subscription = new Subscription();
    constructor(
        private productService: ProductApiService,
        private datePipe: DatePipe,
        private percentPipe: PercentPipe,
        private currencyPipe: CurrencyPipe,
    ) {}

    ngOnInit(): void {
        this.getHistory();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getHistory() {
        this.subscriptions.add(
            this.productService.getProductHistory(this.productId!).subscribe((data: ProductHistory[]) => {
                this.formatData(data);
            }),
        );
    }

    formatData(data: ProductHistory[]) {
        let dataAfterFormat: CRow[] = [];
        data.forEach((detail: ProductHistory) => {
            let row1 = new CRow();
            let row2 = new CRow();
            // type = 0 -> Tạo, type = 1 -> Chỉnh sửa
            switch (detail.type) {
                case 0: {
                    row1 = {
                        listCol: [
                            {
                                text: `${detail.createdBy} khởi tạo sản phẩm từ ${detail.source}`,
                            },
                            {
                                text: ` ${this.datePipe.transform(detail.createdDate)}`,
                            },
                        ],
                        colspan: 4,
                        addClass: 'font-bold italic',
                    };
                    break;
                }
                case 1: {
                    row1 = {
                        listCol: [
                            {
                                text: `${detail.lastModifiedBy} cập nhật thông tin sản phẩm từ ${detail.source}`,
                            },
                            {
                                text: `${this.datePipe.transform(detail.lastModifiedDate)}`,
                            },
                        ],
                        colspan: 4,
                        addClass: 'font-bold italic',
                    };
                    break;
                }
            }
            row2 = {
                listCol: [
                    {
                        text: detail.sku,
                    },
                    {
                        text: detail.productName,
                    },
                    {
                        text: this.percentPipe.transform(detail.vat / 100),
                    },
                    {
                        text: detail.wholeSaleUnit?.unitName,
                    },
                    {
                        text: detail.retailUnit?.unitName,
                    },
                    {
                        text: detail.conversionNumber,
                    },
                    {
                        text: this.currencyPipe.transform(detail.price, 'VND', 'symbol', '1.0-0'),
                    },
                    {
                        text: this.currencyPipe.transform(detail.retailPrice, 'VND', 'symbol', '1.0-0'),
                    },
                ],
            };
            dataAfterFormat.push(row1, row2);
        });
        this.rows = dataAfterFormat;
    }
}
