import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Config } from 'src/app/core/model/Config';
import { FilterService } from '../../services/filter.service';
import { ProductService } from '../../services/product.service';
@Component({
    selector: 'app-product-sidenav',
    templateUrl: './product-sidenav.component.html',
    styleUrls: ['./product-sidenav.component.scss'],
})
export class ProductSidenavComponent implements OnInit {
    searchValues: string = '';
    statusMenu: Config = {
        icon: '<i class="fa-solid fa-flag"></i>',
        title: 'Trạng thái',
        menuChildrens: ['Tất cả', 'Chờ duyệt', 'Đã duyệt', 'Đã bán hàng', 'Đã xuất hàng', 'Từ chối'],
    };
    constructor(private productService: ProductService, private filterService: FilterService) {
        this.search = _.debounce(this.search, 500);
    }

    ngOnInit(): void {}
    search(event: string): void {
        this.filterService.keyword$.next(event);
        this.productService.getInititalProducts(1);
    }
    select(e: any) {
        console.log(e);
    }
}
