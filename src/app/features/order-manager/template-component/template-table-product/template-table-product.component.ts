import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Warehouse } from 'src/app/core/model/Warehousers';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { Product } from '../../models/product';
import { CommonLogicService } from '../../services/commonLogic.service';

@Component({
    selector: 'app-template-table-product',
    templateUrl: './template-table-product.component.html',
    styleUrls: ['./template-table-product.component.scss'],
})
export class TemplateTableProductComponent implements OnInit, AfterViewInit {
    @Input() typeTable: string = ''; // Product / Promotion
    @Input() type: string = ''; // Create / Detail

    productFilterCtrl: FormControl = new FormControl();
    listWarehouse: Warehouse;
    listChoosenProduct: any = [];
    listProductActive$: Observable<Product[]> = this.commonLogicService.listProductActive$;

    constructor(private purchaseService: PurchaseOrderService, private commonLogicService: CommonLogicService) {}

    ngOnInit(): void {
        this.productFilterCtrl.valueChanges.subscribe((data) => {
            this.getListProductActived(data);
        });
    }
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.getListWareHouse();
        }, 0);
    }

    getListWareHouse() {
        this.purchaseService.getAllWarehouses().subscribe((data) => {
            this.listWarehouse = data;
        });
    }

    getListProductActived(keyword: any) {
        this.commonLogicService.searchListProductActived(keyword);
    }

    openDialogProduct() {}

    setWareHouseToAllProduct(e: any) {}
}
