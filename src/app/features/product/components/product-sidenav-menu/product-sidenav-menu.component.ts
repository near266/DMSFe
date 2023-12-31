import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Config } from 'src/app/core/model/Config';
import { ProductSidenavMenuService } from '../../services/product-sidenav-menu.service';

@Component({
    selector: 'app-product-sidenav-menu',
    templateUrl: './product-sidenav-menu.component.html',
    styleUrls: ['./product-sidenav-menu.component.scss'],
    providers: [ProductSidenavMenuService],
})
export class ProductSidenavMenuComponent implements OnInit, AfterViewInit {
    @Input() Config = new Config();
    @Output() Selection = new EventEmitter<string>();
    isShowmenu = false;
    isSelect = false;
    selectedChildren!: string;
    constructor() {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        let iconNode = document.getElementById(`icon-${this.Config.title}`);
        if (this.Config.icon) {
            iconNode!.innerHTML = this.Config.icon;
        }
    }
    select(menuChildren: string) {
        this.isSelect = true;
        this.isShowmenu = false;
        this.selectedChildren = menuChildren;
        this.Selection.emit(menuChildren);
    }

    cancelSelect() {
        this.isSelect = false;
        this.Selection.emit('');
    }

    stopPropagation(e: any) {
        e.stopPropagation();
    }
}
