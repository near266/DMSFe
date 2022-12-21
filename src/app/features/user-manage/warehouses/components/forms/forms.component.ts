import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, AfterViewInit , ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Employee, EmployeeInGroup } from 'src/app/core/model/Employee';
import { UnitGroup } from '../../models/unitGroup';
import { Warehouse } from '../../models/warehouse';
import { LogicService } from '../../services/logic.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit, OnChanges, AfterViewInit, AfterContentChecked{

    @Input() signal: any;
    @Input() type: any;
    @Output() signalEvent = new EventEmitter<boolean>();

    showGroup = false;
    showEmployeeList: boolean = false;
    accountants: EmployeeInGroup[] = [];
    employees: EmployeeInGroup[] = [];
    listIdAccountant: string[] = [];
    warehouse: Warehouse = {
        id: '',
        warehouseName: '',
        warehouseCode: '',
        warehouseType: '',
        status: false,
        description: '',
        responsibleAccountant: '',
        createdBy: '',
        createdDate: '',
        lastModifiedBy: '',
        lastModifiedDate: '',
        employee: {
            id: '',
            employeeCode: '',
            employeeName: '',
            email: '',
            employeeTitle: ''
        }
    };
    formGroup: FormGroup;
    unitGroup: UnitGroup[] = [];

    constructor(private logic: LogicService, private fb: FormBuilder, private cd: ChangeDetectorRef) { }
    ngAfterContentChecked(): void {
        // this.showEmployeeList = true;
        // this.cdref.detectChanges();
    }

    ngAfterViewInit(): void {
        Promise.resolve().then(() => {
            this.showEmployeeList = false;
        });
        this.init();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes['signal'].currentValue == true) {
            this.submit();
        }
    }

    ngOnInit(): void {
        this.formGroup = this.fb.group({
            warehouseName: new FormControl(''),
            warehouseCode: new FormControl(''),
            warehouseType: new FormControl(''),
            status: new FormControl(true),
            description: new FormControl(''),
            employeeId: new FormControl(''),
            unitTreeGroupId: new FormControl('')
        });
    }

    init() {
        this.getUnitGroup();
        if(this.type != 0) {
            this.logic.getWarehouse(this.type);
            this.logic.detailWarehouse$.subscribe( warehouse => {
                this.warehouse = warehouse;
                if(this.warehouse.warehouseEmployee) {
                    this.accountants = [];
                    this.warehouse.warehouseEmployee.forEach(e => {
                        let employee: Employee = {
                            id: e.accountant.id,
                            employeeCode: e.accountant.employeeCode,
                            employeeName: e.accountant.employeeName,
                            email: e.accountant.email,
                            employeeTitle: e.accountant.employeeTitle,
                            checked: true,
                            avatar: e.accountant.avatar
                        }
                        let accountant: EmployeeInGroup = {
                            employee: employee
                        }
                        this.listIdAccountant.push(e.accountant.id);
                        this.accountants.push(accountant);
                    });
                }
                this.formGroup.controls['warehouseName'].setValue(this.warehouse.warehouseName);
                this.formGroup.controls['warehouseCode'].setValue(this.warehouse.warehouseCode);
                this.formGroup.controls['warehouseType'].setValue(this.warehouse.warehouseType);
                this.formGroup.controls['status'].setValue(this.warehouse.status);
                this.formGroup.controls['description'].setValue(this.warehouse.description);
                this.formGroup.controls['employeeId'].setValue(this.warehouse.employee?.id);
                this.formGroup.controls['unitTreeGroupId'].setValue(this.warehouse.unitTreeGroup?.id);
                if(this.formGroup.controls['warehouseType'].value == 'Kho nhân viên') {
                    Promise.resolve().then(() => {
                        this.showEmployeeList = true;
                    });
                    this.cd.detectChanges();
                }
                else {
                    Promise.resolve().then(() => {
                        this.showEmployeeList = false;
                    });
                    this.cd.detectChanges();
                }
                if(this.warehouse.unitTreeGroup?.id) {
                    this.logic.getEmployee(this.warehouse.unitTreeGroup?.id);
                    this.logic.employee$.subscribe(data => {
                        this.employees = data;
                    });
                }

            });
        }
    }

    getUnitGroup() {
        this.logic.getUnitGroup();
        this.logic.unitGroup$.subscribe( group => {
            this.unitGroup = group;
        });
    }

    selectEmployeeList(typeWarehouse: string) {
        switch(typeWarehouse) {
            case 'Kho sản phẩm': {
                Promise.resolve().then(() => {
                    this.showEmployeeList = false;
                });
                return;
            }
            case 'Kho khuyến mãi': {
                Promise.resolve().then(() => {
                    this.showEmployeeList = false;
                });
                return;
            }
            case 'Kho nhân viên': {
                Promise.resolve().then(() => {
                    this.showEmployeeList = true;
                });
                return;
            }
        }
    }

    searchBySelect(event: any) {
        this.accountants = [];
        this.logic.getAccountant('root');
        this.logic.getEmployee(event);
        this.logic.accountant$.subscribe(data => {
            this.accountants = data;
            this.accountants.forEach( e => {
               if(this.listIdAccountant.indexOf('' + e.employee.id) > -1) {
                    e.employee.checked = true;
               } else {
                    e.employee.checked = false;
               }
            });
        });

        this.logic.employee$.subscribe(data => {
            this.employees = data;
        })
    }

    search(event: any) {
        this.accountants = [];
        this.logic.getAccountant(event);
        // this.logic.getEmployee(event);
        this.logic.accountant$.subscribe(data => {
            this.accountants = data;
            this.accountants.forEach( e => {
               if(this.listIdAccountant.indexOf('' + e.employee.id) > -1) {
                    e.employee.checked = true;
               } else {
                    e.employee.checked = false;
               }
            });
        });

        // this.logic.employee$.subscribe(data => {
        //     this.employees = data;
        // })
    }

    toggleAccountant(id: any) {
        if(this.listIdAccountant.indexOf(id) > -1) {
            this.listIdAccountant.splice(this.listIdAccountant.indexOf(id), 1);
        } else {
            this.listIdAccountant.push(id);
        }
    }

    submit() {
        let body: any = {
            warehouseName: this.formGroup.controls['warehouseName'].value,
            warehouseCode: this.formGroup.controls['warehouseCode'].value,
            warehouseType: this.formGroup.controls['warehouseType'].value,
            status: this.formGroup.controls['status'].value,
            description: this.formGroup.controls['description'].value,
            listAccId: this.listIdAccountant,
            employeeId: this.formGroup.controls['employeeId'].value,
            unitTreeGroupId: this.formGroup.controls['unitTreeGroupId'].value
        };
        if(body.warehouseType != 'Kho nhân viên') {
            delete body['employeeId'];
            delete body['unitTreeGroupId'];
        }
        if(body.status == 'true') body.status = true;
        if(body.status == 'false') body.status = false;
        if(this.type == 0) {
            this.logic.addWarehouse(body);
            this.logic.message$.subscribe( message => {
                this.signalEvent.emit(message);
            });
        } else {
            body.id = this.warehouse.id;
            this.logic.updateWarehouse(body);
            this.logic.isUpdateSuccess$.subscribe( message => {
                this.signalEvent.emit(message);
            });
        }
    }

}
