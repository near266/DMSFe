import {
    AfterViewInit,
    Component,
    DoCheck,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import moment from 'moment';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { debounceTime, Observable, Subscription } from 'rxjs';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { GroupModel } from '../../models/group';
import { CommonLogicService } from '../../services/commonLogic.service';
import { PurchaseLogicService } from '../../services/purchaseLogic.service';
import { SaleLogicService } from '../../services/saleLogic.service';
import { Payment } from '../template-footer-order/template-footer-order.component';

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

export class DataInput {
    code?: string;
    status!: number;
    orderDate?: string;
    saleDate?: string;
    deliveryDate?: string;
    groupId?: string;
    orderEmployeeId?: string;
    saleEmployee?: string;
    routeId?: string;
    customerId?: string;
    customerName?: string;
    phone?: string;
    address?: string;
    description?: string;
    relatedId?: string;
}

export class coppyObject {
    groupCoppy?: string;
    orderCoppy?: string;
    routeCoppy?: string;
    customerCoppy?: string;
    saleCoppy?: string;
}

@Component({
    selector: 'app-template-infor-order',
    templateUrl: './template-infor-order.component.html',
    styleUrls: ['./template-infor-order.component.scss'],
})
export class TemplateInforOrderComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy, DoCheck {
    @Input() option: Option;
    @Input() data: any;
    @Input() id: string;
    @Input() payment: Payment;
    @Input() coppyObject: coppyObject = new coppyObject();
    @Output() createBody$: EventEmitter<any> = new EventEmitter();
    @Output() genSaleBody$: EventEmitter<any> = new EventEmitter();

    private subscriptions: Subscription = new Subscription();

    groupCoppy: any = '';
    orderCoppy: any = '';
    routeCoppy: any = '';
    customerCoppy: any = '';
    saleCoppy: any = '';

    form: FormGroup = this.fb.group({
        description: [''],
    });
    roleMain: string = 'member';

    orderEmployeeCtrl: FormControl = new FormControl();
    saleEmployeeCtrl: FormControl = new FormControl();
    routeCtrl: FormControl = new FormControl();
    cusCtrl: FormControl = new FormControl();
    cusText: string;

    @AutoUnsubscribe()
    isEdit$ = this.commonLogicService.isEdit$;
    @AutoUnsubscribe()
    listEmployee$: Observable<any[]> = this.commonLogicService.listEmployee$;
    @AutoUnsubscribe()
    listSaleEmployee$: Observable<any[]> = this.commonLogicService.listSaleEmployee$;
    @AutoUnsubscribe()
    listRoute$: Observable<any[]> = this.commonLogicService.listRoute$;
    @AutoUnsubscribe()
    listCus$: Observable<any[]> = this.commonLogicService.listCus$;
    @AutoUnsubscribe()
    listGroup$: Observable<GroupModel[]> = this.commonLogicService.listGroup$;

    constructor(
        private router: Router,
        private purchaseOrder: PurchaseOrderService,
        private commonLogicService: CommonLogicService,
        private fb: FormBuilder,
        private purchaseLogicService: PurchaseLogicService,
        private saleLogicService: SaleLogicService,
        private snackbar: SnackbarService,
    ) {}

    ngOnInit(): void {
        this.roleMain = localStorage.getItem('roleMain')!;
        this.initializationForm();
        this.subscriptions.add(
            this.commonLogicService.isSave$.subscribe((data) => {
                if (data) {
                    this.save();
                }
            }),
        );
        this.subscriptions.add(
            this.commonLogicService.isCreate$.subscribe((data) => {
                if (data) {
                    this.create();
                }
            }),
        );
        if (this.option.type === 'Gen') {
            this.subscriptions.add(
                this.purchaseLogicService.isGen$.subscribe((data) => {
                    if (data) {
                        this.genSale();
                    }
                }),
            );
        }
        this.searchListOrderEmployee();
        this.searchListSaleEmployee();
        this.searchListRoute();
        this.searchListCus();
        this.setAutoDefaultInfo();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.getListGroup();
            this.geListCus();
            this.getListEmployee();
            this.getListSaleEmployee();
            this.getListRoute();
            this.getCoppyText();
        }, 0);
    }

    ngOnChanges(changes: SimpleChanges): void {
        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
                switch (propName) {
                    case 'data': {
                        if (this.option.type === 'Detail') {
                            this.patchValue();
                        }
                        if (this.option.type === 'Gen') {
                            this.patchValue();
                        }
                        console.log(this.data);
                        break;
                    }
                    case 'option': {
                        if (this.option.type === 'Create') {
                            this.commonLogicService.changeToCreateType();
                        }
                        break;
                    }
                    case 'coppyObject': {
                        this.getCoppyText();
                    }
                }
            }
        }
    }

    ngDoCheck(): void {
        if (this.option.type === 'Create') {
            this.createBody$.emit(this.form);
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    genSale() {
        this.genSaleBody$.emit(this.form);
    }

    // Chỉ ở màn tạo
    setAutoDefaultInfo() {
        if (this.option.type === 'Create' && this.option.order === 'Purchase') {
            this.setAutoDefaultCreatePurchase();
        } else if (this.option.type === 'Create' && this.option.order === 'Sale') {
            this.setAutoDefaultCreateSale();
        }
    }

    setAutoDefaultCreatePurchase() {
        let idDefault = this.commonLogicService.getIdDefault();
        this.commonLogicService.pushOrderEmployeeToListEmployee(idDefault, []);
        this.form!.patchValue({
            orderDate: moment(Date.now()).format('YYYY-MM-DD'),
            deliveryDate: moment(Date.now()).format('YYYY-MM-DD'),
            status: 1,
            orderEmployeeId: idDefault,
        });
    }

    setAutoDefaultCreateSale() {
        let idDefault = this.commonLogicService.getIdDefault();
        this.commonLogicService.pushSaleEmployeeToListEmployee(idDefault, []);
        this.form!.patchValue({
            saleDate: moment(Date.now()).format('YYYY-MM-DD'),
            deliveryDate: moment(Date.now()).format('YYYY-MM-DD'),
            status: 3, // trạng thái đã bán hàng
            saleEmployee: idDefault,
            orderDate: moment(Date.now()).format('YYYY-MM-DD'),
        });
    }

    private searchListCus() {
        this.subscriptions.add(
            this.cusCtrl.valueChanges.pipe(debounceTime(300)).subscribe((keyword) => {
                if (keyword != '') {
                    this.purchaseOrder
                        .searchCustomer({ page: 1, pageSize: 10, keyword: keyword.trim() })
                        .subscribe((listCusSearched: any) => {
                            console.log(listCusSearched.data);
                            this.commonLogicService.pushCusToListCus(this.data?.customerId, listCusSearched.data);
                        });
                }
            }),
        );
    }

    private searchListRoute() {
        this.subscriptions.add(
            this.routeCtrl.valueChanges.pipe(debounceTime(300)).subscribe((keyword) => {
                if (keyword != '') {
                    this.purchaseOrder.getAllRoute(1, 10, keyword.trim()).subscribe((listRouteSearch) => {
                        this.commonLogicService.pushRouteToListRoute(this.data?.routeId, listRouteSearch.data);
                    });
                }
            }),
        );
    }

    private searchListSaleEmployee() {
        this.subscriptions.add(
            this.saleEmployeeCtrl.valueChanges.pipe(debounceTime(300)).subscribe((keyword) => {
                if (keyword != '') {
                    this.purchaseOrder.getAllEmployees(keyword.trim(), 1, 10).subscribe((listSearched) => {
                        this.commonLogicService.pushSaleEmployeeToListEmployee(this.data?.id, listSearched.data);
                    });
                }
            }),
        );
    }

    private searchListOrderEmployee() {
        this.subscriptions.add(
            this.orderEmployeeCtrl.valueChanges.pipe(debounceTime(300)).subscribe((keyword) => {
                if (keyword != '') {
                    this.purchaseOrder
                        .getAllEmployees(keyword.trim(), 1, 10)
                        .subscribe((listSearched: any) =>
                            this.commonLogicService.pushOrderEmployeeToListEmployee(
                                this.data?.orderEmployeeId,
                                listSearched.data,
                            ),
                        );
                }
            }),
        );
    }

    setInfoCusAndRouteGroupAndOrderEmployee(cusId: string) {
        this.setInfoCus(cusId);
        this.setRouteGroupAndOrderEmployee(cusId);
    }

    setInfoCus(cusId: string) {
        this.subscriptions.add(
            this.purchaseOrder.getCustomerById(cusId).subscribe((customer) => {
                this.form.patchValue({
                    address: customer.address,
                    phone: customer.phone,
                    customerName: customer.customerName,
                });
            }),
        );
    }

    setRouteGroupAndOrderEmployee(cusId: string) {
        this.subscriptions.add(
            this.purchaseOrder.getRouteByCustomerId(cusId).subscribe((data) => {
                if (data) {
                    this.commonLogicService.pushOrderEmployeeToListEmployee(data.route?.employee?.id, []);
                    this.commonLogicService.pushRouteToListRoute(data.route?.id, []);
                    this.form.patchValue({
                        routeId: data.route?.id,
                        groupId: data.route?.unitTreeGroup?.id,
                        orderEmployeeId: data.route?.employee?.id,
                    });
                }
            }),
        );
    }

    save() {
        if (this.option.order === 'Purchase') {
            this.purchaseLogicService.updateOrder(this.payment, this.form, this.id);
        } else if (this.option.order === 'Sale') {
            this.saleLogicService.updateOrder(this.payment, this.form, this.id);
        }
    }

    create() {
        this.createBody$.emit('Tạo');
    }

    initializationForm() {
        this.form = this.fb.group({
            relatedId: [''],
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
        this.pushOrderEmployeeToListEmployee();
        this.pushSaleEmployeeToListEmployee();
        this.pushRouteToListRoute();
        if (this.data) {
            this.form!.patchValue({
                code: this.data.code,
                status: this.data.status,
                orderDate: this.data.orderDate,
                deliveryDate: this.data.deliveryDate,
                saleDate: this.data.saleDate,
                groupId: this.data.groupId,
                orderEmployeeId: this.data.orderEmployeeId,
                saleEmployee: this.data.saleEmployee,
                routeId: this.data.routeId,
                customerId: this.data.customerId,
                customerName: this.data.customerName,
                phone: this.data.phone,
                address: this.data.address,
                description: this.data.description,
                relatedId: this.data.relatedId,
            });
        }
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

    getListSaleEmployee() {
        this.commonLogicService.getListSaleEmployee(this.roleMain);
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
            this.commonLogicService.pushCusToListCus(this.data.customerId, []);
        }
    }

    pushSaleEmployeeToListEmployee() {
        if (this.data && this.data.saleEmployee) {
            this.commonLogicService.pushSaleEmployeeToListEmployee(this.data.saleEmployee, []);
        }
    }

    pushOrderEmployeeToListEmployee() {
        if (this.data && this.data.orderEmployeeId) {
            this.commonLogicService.pushOrderEmployeeToListEmployee(this.data.orderEmployeeId, []);
        }
    }

    pushRouteToListRoute() {
        if (this.data && this.data.routeId) {
            this.commonLogicService.pushRouteToListRoute(this.data.routeId, []);
        }
    }

    coppy(value: any, e: any) {
        e.stopPropagation();
        navigator.clipboard.writeText(value);
        this.snackbar.openSnackbar('Sao chép thành công', 1000, 'Đóng', 'center', 'bottom', true);
    }

    getCoppyText() {
        this.groupCoppy = this.coppyObject?.groupCoppy;
        this.orderCoppy = this.coppyObject?.orderCoppy;
        this.routeCoppy = this.coppyObject?.routeCoppy;
        this.customerCoppy = this.coppyObject?.customerCoppy;
        this.saleCoppy = this.coppyObject?.saleCoppy;
    }
}
