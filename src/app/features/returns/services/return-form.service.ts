import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Subject, tap } from 'rxjs';
import { CustomerService } from 'src/app/core/services/customer.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ReturnApiService } from '../apis/return-api.service';
import { ReturnDetailsService } from './return-details.service';
import { ReturnOrderService } from './return-order.service';
import { ReturnsService } from './returns.service';
import { ProductApiService } from '../../product/apis/product.api.service';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';

@Injectable({
    providedIn: 'root',
})
export class ReturnFormService {
    constructor(
        private returnApiService: ReturnApiService,
        private customerService: CustomerService,
        private returnsService: ReturnsService,
        private returnOrderService: ReturnOrderService,
        private returnDetailsService: ReturnDetailsService,
        private snackBarService: SnackbarService,
        private purchaseOrder: PurchaseOrderService,
        private dialog: MatDialog,
        private router: Router,
    ) {}
    totalPrice$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    submitInfoForm$: Subject<any> = new Subject<any>();
    submitProductForm$: Subject<any> = new Subject<any>();
    submitPromotionForm$: Subject<any> = new Subject<any>();
    discountAmount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    formValues$: Subject<any> = new Subject<any>();
    products$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    promotionProducts$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

    getOrderDetailsById(id: string) {
        // <--- this method is not used in real cases
        return this.returnApiService.getOrderDetailsById(id).pipe(
            map((result) => {
                console.log(result);
                return {
                    ...result,
                    customerId: result.customer?.id || null,
                    customerCode: result.customer?.customerCode || null,
                    orderId: result.orderCode || null,
                    orderEmployeeId: result.orderEmployee?.id || null,
                };
            }),
        );
    }
    getEmployees() {
        return this.returnApiService.getEmployees().pipe(
            map((result) => {
                return result.data.map((data: any) => {
                    const { id: value, employeeName, employeeTitle } = data;
                    let label = employeeName;
                    if (employeeTitle) {
                        label = employeeName + ' - ' + employeeTitle;
                    }
                    return { value, label };
                });
            }),
        );
    }

    getGroupsAndFilter() {
        return this.returnApiService.getGroups().pipe(
            map((result) => {
                return result.map((data: any) => {
                    const { id: value, name } = data;
                    let label = name;
                    return { value, label };
                });
            }),
        );
    }
    getEmployeesByGroupId(id: string) {
        return this.returnApiService.getEmployeesByGroup(id).pipe(
            map((result) => {
                return result.data.map((data: any) => {
                    const { employee } = data;
                    const value = employee.id;
                    let label = employee.employeeName;
                    if (employee.employeeTitle) {
                        label = employee.employeeName + ' - ' + employee.employeeTitle;
                    }
                    console.log({ value, label });
                    return { value, label };
                });
            }),
        );
    }

    addNewReturn(form: any) {
        return this.returnApiService.createNewReturn(form).subscribe({
            next: (result) => {
                this.snackBarService.openSnackbar('Tạo phiếu trả hàng thành công', 2000, 'Đóng', 'center', 'top', true);
                this.totalPrice$.next(0);
                this.discountAmount$.next(0);
                this.dialog.closeAll();
                this.router.navigate(['/returns']);
                this.returnOrderService.updatePurchaseOrderStatus(6);
            },
            error: (error) => {
                this.snackBarService.openSnackbar('Tạo phiếu trả hàng thất bại', 2000, 'Đóng', 'center', 'top', false);
            },
        });
    }
    updateReturn(form: any) {
        return this.returnApiService.updateReturn(form).subscribe({
            next: (result) => {
                this.snackBarService.openSnackbar('Cập nhật trả hàng thành công', 2000, 'Đóng', 'center', 'top', true);
                this.totalPrice$.next(0);
                this.discountAmount$.next(0);
                this.dialog.closeAll();
                this.returnDetailsService.currentMode$.next(0);
                this.router.navigate(['/returns']);
            },
            error: (error) => {
                this.snackBarService.openSnackbar('Tạo phiếu trả hàng thất bại', 2000, 'Đóng', 'center', 'top', false);
            },
        });
    }

    deleteReturn(id: string) {
        return this.returnApiService.archiveReturn(id).subscribe({
            next: (result) => {
                this.snackBarService.openSnackbar('Xóa phiếu trả hàng thành công', 2000, 'Đóng', 'center', 'top', true);
                this.totalPrice$.next(0);
                this.discountAmount$.next(0);
                this.dialog.closeAll();
                this.router.navigate(['/returns']);
            },
            error: (error) => {
                this.snackBarService.openSnackbar('Xóa phiếu trả hàng thất bại', 2000, 'Đóng', 'center', 'top', false);
            },
        });
    }

    getAllCustomers() {
        return this.customerService
            .search({
                keyword: '',
                page: 1,
                pageSize: 100,
            })
            .pipe(
                map((result) => {
                    const customers = result.data;
                    return customers.map((customer: any) => {
                        const { id: value, customerCode, customerName, address, phone } = customer;
                        const label = customerCode + ' - ' + customerName;
                        return { value, label, customerName, address, phone };
                    });
                }),
            );
    }

    filterCustomerById(id: string) {
        return this.getAllCustomers().pipe(
            map((result) => {
                return result.filter((customer: any) => customer.value === id);
            }),
        );
    }
    submitForms() {
        this.submitProductForm$.next(true);
    }
    getAllProducts() {
        const settings = {
            keyword: '',
            page: 1,
            pageSize: 100,
        };
        return this.purchaseOrder
            .getListProductActived({
                sortBy: {
                    property: 'CreatedDate',
                    value: true,
                },
                page: 1,
                pageSize: 1000,
            })
            .pipe(
                map((result) =>
                    result.data.map((product: any) => {
                        return { ...product, label: product.sku + ' - ' + product.productName };
                    }),
                ),
            );
    }
    addProductToProductList(product: any) {
        const { label, ...result } = product;
        this.products$.next([...this.products$.getValue(), result]);
    }
    addProductToPromotionList(product: any) {
        const { label, ...result } = product;
        this.promotionProducts$.next([...this.promotionProducts$.getValue(), result]);
    }
}
