import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    OnDestroy,
    DoCheck,
    Output,
    EventEmitter,
    ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { Observable, Subscription } from 'rxjs';
import { NumberToTextService } from 'src/app/core/shared/services/number-to-text.service';
import { CommonLogicService } from '../../services/commonLogic.service';
import { PurchaseLogicService } from '../../services/purchaseLogic.service';
import { SaleLogicService } from '../../services/saleLogic.service';

export class Payment {
    textMoney: string;
    prePayment: number;
    totalAmount: number;
    totalDiscountProduct: number;
    tradeDiscount: number;
    totalPayment: number;
    paymentTerm?: string;
    debtRecord?: boolean;
    debtLimit?: number;
    debtCurrent?: number;
}

@Component({
    selector: 'app-template-footer-order',
    templateUrl: './template-footer-order.component.html',
    styleUrls: ['./template-footer-order.component.scss'],
})
export class TemplateFooterOrderComponent implements OnInit, OnChanges, OnDestroy, DoCheck {
    @Input() payment: Payment = {
        textMoney: '0',
        prePayment: 0,
        totalAmount: 0,
        totalDiscountProduct: 0,
        tradeDiscount: 0,
        totalPayment: 0,
    };
    @Input() order: {
        screenType: string;
        orderType: string;
    };
    @Output() paymentCreate$: EventEmitter<Payment> = new EventEmitter();

    private subscriptions: Subscription = new Subscription();

    @AutoUnsubscribe()
    isEdit$: Observable<boolean> = this.commonLogicService.isEdit$;
    paymentForm: FormGroup = this.fb.group({
        paymentTerm: [moment(Date.now()).format('YYYY-MM-DD')],
        debtRecord: [null],
    });
    paymentTerm: FormControl = new FormControl();
    debtRecord: FormControl = new FormControl();
    constructor(
        private fb: FormBuilder,
        private numberToText: NumberToTextService,
        private commonLogicService: CommonLogicService,
        private purchaseLogicService: PurchaseLogicService,
        private saleLogicService: SaleLogicService,
        private cdref: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.commonLogicService.isSave$.subscribe((data) => {
                if (data) {
                    this.save();
                }
            }),
        );
        if (this.order.screenType === 'Create') {
            this.commonLogicService.changeToCreateType();
        }
        this.payment.tradeDiscount = 0;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.payment) {
            this.patchValue();
            this.setTotalAmount();
            this.countTotalPayment();
        }
    }

    ngDoCheck(): void {
        // Phải dùng docheck vì độ trễ
        if (this.order.orderType === 'Sale' && this.order.screenType === 'Detail') {
            this.payment.paymentTerm = moment(this.paymentForm.get('paymentTerm')?.value).format('YYYY-MM-DD');
            this.payment.debtRecord = this.paymentForm.get('debtRecord')?.value;
            this.saleLogicService.setPaymentSource(this.payment);
        }
        if (this.order.screenType === 'Create') {
            this.payment.paymentTerm = moment(this.paymentForm.get('paymentTerm')?.value).format('YYYY-MM-DD');
            this.payment.debtRecord = this.paymentForm.get('debtRecord')?.value;
            this.create();
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    patchValue() {
        this.paymentForm.patchValue({
            paymentTerm: this.payment.paymentTerm || moment(Date.now()).format('YYYY-MM-DD'),
            debtRecord: this.payment.debtRecord,
        });
    }

    save() {}

    create() {
        this.paymentCreate$.emit(this.payment);
    }

    setTotalAmount() {
        this.payment.totalAmount =
            this.payment.totalPayment + this.payment.tradeDiscount + this.payment.totalDiscountProduct;
    }

    countTotalPayment() {
        this.payment.totalPayment = 0;
        if (this.payment.totalAmount) {
            this.payment.totalPayment =
                this.payment.totalAmount - this.payment.tradeDiscount - this.payment.totalDiscountProduct;
            this.genTextMoney();
        }
    }

    genTextMoney() {
        this.payment.textMoney = this.numberToText.doc(this.payment.totalPayment);
    }
}
