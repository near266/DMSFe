import { ifStmt } from '@angular/compiler/src/output/output_ast';
import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    DoCheck,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Group } from 'src/app/core/model/PurchaseOrder';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { GroupModel } from '../../models/group';
import { CommonLogicService } from '../../services/commonLogic.service';

export class Option {
    title?: string;
    routerLink?: string;
    type!: string;
    order!: string;
    status?: Status[];
}

export class Status {
    value: number;
    name: string;
}

@Component({
    selector: 'app-template-infor-order',
    templateUrl: './template-infor-order.component.html',
    styleUrls: ['./template-infor-order.component.scss'],
})
export class TemplateInforOrderComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() option: Option;
    @Input() data: any;
    @Input() isEdit: boolean = false;

    form: FormGroup;
    roleMain: string = 'member';
    employeeCtrl: FormControl = new FormControl();
    routeCtrl: FormControl = new FormControl();
    cusCtrl: FormControl = new FormControl();

    listEmployee$: Observable<any[]> = this.commonLogicService.listEmployee$;
    listRoute$: Observable<any[]> = this.commonLogicService.listRoute$;
    listCus$: Observable<any[]> = this.commonLogicService.listCus$;
    listGroup$: Observable<GroupModel[]> = this.commonLogicService.listGroup$;

    constructor(
        private router: Router,
        private purchaseOrder: PurchaseOrderService,
        private commonLogicService: CommonLogicService,
        private fb: FormBuilder,
    ) {}

    ngOnInit(): void {
        this.roleMain = localStorage.getItem('roleMain')!;
        this.initializationForm();
    }

    ngAfterViewInit(): void {
        this.getListGroup();
        this.geListCus();
        this.getListEmployee();
        this.getListRoute();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.option.type === 'Detail' && this.data) {
            this.patchValue();
        }
        console.log(this.isEdit);
    }

    initializationForm() {
        this.form = this.fb.group({
            code: [''],
            status: [''],
            orderDate: [''],
            saleDate: [''],
            deliveryDate: [''],
            groupId: [''],
            orderEmployeeId: [''],
            saleEmployee: [''],
            routeId: [''],
            customerId: [''],
            customerName: [''],
            phone: [''],
            address: [''],
            description: [''],
        });
    }

    patchValue() {
        this.pushCusToListCus();
        this.form.patchValue({
            code: this.data.code,
            status: this.data.status,
            orderDate: this.data.orderDate,
            deliveryDate: this.data.deliveryDate,
            groupId: this.data.groupId,
            orderEmployeeId: this.data.orderEmployeeId,
            routeId: this.data.routeId,
            customerId: this.data.customerId,
            customerName: this.data.customerName,
            phone: this.data.phone,
            address: this.data.address,
            description: this.data.description,
        });
    }

    cancel() {
        this.router.navigate([`/${this.option.routerLink}`]);
    }

    getListGroup() {
        this.commonLogicService.getListGroup();
    }

    getListEmployee() {
        this.commonLogicService.getListEmployee(this.roleMain);
    }

    getListRoute() {
        this.commonLogicService.getListRoute(this.roleMain);
    }

    geListCus() {
        // Nếu type = Detail -> chưa get list cus
        if (this.option.type === 'Create') {
            this.commonLogicService.getListCus(this.roleMain);
        } else {
            this.pushCusToListCus();
        }
    }

    pushCusToListCus() {
        if (this.data && this.data.customerId) {
            this.commonLogicService.pushCusToListCus(this.data.customerId);
        }
    }
}
