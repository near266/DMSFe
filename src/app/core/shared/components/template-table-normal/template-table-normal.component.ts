import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild,
} from '@angular/core';

@Component({
    selector: 'app-template-table-normal',
    templateUrl: './template-table-normal.component.html',
    styleUrls: ['./template-table-normal.component.scss'],
})
export class TemplateTableNormalComponent implements OnInit, AfterViewInit {
    @ViewChild('header') header!: ElementRef;
    @Input() headers: string[] = [];
    @Input() rows: CRow[] = [];
    @Input() colorHeader: string = '';
    constructor() {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.header.nativeElement.style.backgroundColor = this.colorHeader;
        this.header.nativeElement.style.color = 'white';
    }
}

export class CRow {
    listCol: CTd[];
    colspan?: number;
    addClass?: string;
}

export class CTd {
    text?: string;
    addClass?: string;
}
