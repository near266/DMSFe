import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Response } from 'src/app/core/model/Response';
import { CustomerService } from 'src/app/core/services/customer.service';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ProductApiService } from '../../product/apis/product.api.service';
import { Customer } from '../models/Customer';
import { IBody } from '../models/IBody';
import { Order } from '../models/Order';
import { Product } from '../models/Product';

@Injectable({
    providedIn: 'root',
})
export class LogicService {
    private readonly defaultCustomers: Customer[] = [];
    private readonly defaultProducts: Product[] = [];
    private readonly defaultOrders: Order[] = [];

    private customers: BehaviorSubject<Customer[]> = new BehaviorSubject<Customer[]>(this.defaultCustomers);
    private products: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(this.defaultProducts);
    private orders: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>(this.defaultOrders);
    private totalCustomer: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private totalOrder: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private totalProduct: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    private changes: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private totalCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    public customers$ = this.customers.asObservable();
    public products$ = this.products.asObservable();
    public orders$ = this.orders.asObservable();
    public totalProduct$ = this.totalProduct.asObservable();
    public totalOrder$ = this.totalOrder.asObservable();
    public totalCustomer$ = this.totalCustomer.asObservable();
    public changes$ = this.changes.asObservable();
    public totalCount$ = this.totalCount.asObservable();

    constructor(
        private customerService: CustomerService,
        private orderService: PurchaseOrderService,
        public snackbar: SnackbarService,
        private productService: ProductApiService,
    ) {}

    // Customer service

    getCustomer(body: IBody) {
        if (body.page > 1 || body.keyword) {
            this.changes.next(true);
        }
        this.customerService.searchArchived(body.page, body.pagesize, body.keyword).subscribe(
            (response: Response<Customer>) => {
                if (response) {
                    if (response.data) this.customers.next(response.data);
                    else this.customers.next(this.defaultCustomers);
                    this.totalCustomer.next(response.totalCount);
                } else {
                    this.snackbar.openSnackbar(
                        'Không tìm thấy danh sách khách hàng',
                        2000,
                        'Đóng',
                        'center',
                        'bottom',
                        false,
                    );
                    this.customers.next(this.defaultCustomers);
                    this.totalCustomer.next(0);
                }
            },
            (error) => {
                this.snackbar.openSnackbar(
                    'Không tìm thấy danh sách khách hàng',
                    2000,
                    'Đóng',
                    'center',
                    'bottom',
                    false,
                );
                this.customers.next(this.defaultCustomers);
                this.totalCustomer.next(0);
            },
        );
    }

    restoreCustomer(body: any, bodyGet: IBody) {
        this.customerService.archivedCustomer(body).subscribe(
            (data) => {
                if (data && data.message == true) {
                    this.snackbar.openSnackbar(
                        'Khôi phục các bản ghi thành công',
                        2000,
                        'Đóng',
                        'center',
                        'bottom',
                        true,
                    );
                    this.getCustomer(bodyGet);
                } else {
                    this.snackbar.openSnackbar(
                        'Khôi phục các bản ghi thất bại',
                        2000,
                        'Đóng',
                        'center',
                        'bottom',
                        false,
                    );
                }
            },
            (error) => {
                this.snackbar.openSnackbar('Khôi phục các bản ghi thất bại', 2000, 'Đóng', 'center', 'bottom', false);
            },
        );
    }

    deleteCustomer(body: any, bodyGet: IBody) {
        this.customerService.delete(body).subscribe(
            (data) => {
                if (data && data.data > 0) {
                    this.snackbar.openSnackbar('Xóa các bản ghi thành công', 2000, 'Đóng', 'center', 'bottom', true);
                    this.getCustomer(bodyGet);
                } else {
                    this.snackbar.openSnackbar('Xóa các bản ghi thất bại', 2000, 'Đóng', 'center', 'bottom', false);
                }
            },
            (error) => {
                this.snackbar.openSnackbar('Xóa các bản ghi thất bại', 2000, 'Đóng', 'center', 'bottom', false);
            },
        );
    }

    // Product service

    getProduct(body: IBody) {
        if (body.page > 1 || body.keyword) {
            this.changes.next(true);
        }
        this.orderService.searchArchivedProduct(body).subscribe(
            (response: Response<Product>) => {
                if (response) {
                    if (response.data) this.products.next(response.data);
                    else this.products.next(this.defaultProducts);
                    this.totalProduct.next(response.totalCount);
                } else {
                    this.snackbar.openSnackbar(
                        'Không tìm thấy danh sách sản phẩm',
                        2000,
                        'Đóng',
                        'center',
                        'bottom',
                        false,
                    );
                    this.products.next(this.defaultProducts);
                    this.totalProduct.next(0);
                }
            },
            (error) => {
                this.snackbar.openSnackbar(
                    'Không tìm thấy danh sách sản phẩm',
                    2000,
                    'Đóng',
                    'center',
                    'bottom',
                    false,
                );
                this.products.next(this.defaultProducts);
                this.totalProduct.next(0);
            },
        );
    }

    restoreProduct(listId: string[], bodyGet: IBody) {
        this.productService.restoreProduct(listId).subscribe({
            next: (data: any) => {
                if (data) {
                    this.getProduct(bodyGet);
                }
            },
            error: (err: HttpErrorResponse) => {
                this.snackbar.openSnackbar('Khôi phục bản ghi thất bại', 2000, 'Đóng', 'center', 'bottom', false);
            },
            complete: () => {
                this.snackbar.openSnackbar('Khôi phục bản ghi thành công', 2000, 'Đóng', 'center', 'bottom', true);
            },
        });
    }

    deleteProduct(body: any, bodyGet: IBody) {
        this.orderService.deleteProduct(body).subscribe(
            (data) => {
                if (data && data.message > 0) {
                    this.snackbar.openSnackbar('Xóa các bản ghi thành công', 2000, 'Đóng', 'center', 'bottom', true);
                    this.getProduct(bodyGet);
                } else {
                    this.snackbar.openSnackbar('Xóa các bản ghi thất bại', 2000, 'Đóng', 'center', 'bottom', false);
                }
            },
            (error) => {
                this.snackbar.openSnackbar('Xóa các bản ghi thất bại', 2000, 'Đóng', 'center', 'bottom', false);
            },
        );
    }

    // Order service

    getOrder(body: IBody) {
        if (body.page > 1 || body.keyword) {
            this.changes.next(true);
        }
        this.orderService.searchArchived(body).subscribe(
            (response) => {
                if (response) {
                    if (response.data) this.orders.next(response.data);
                    else this.orders.next(this.defaultOrders);
                    this.totalOrder.next(response.total);
                } else {
                    this.snackbar.openSnackbar(
                        'Không tìm thấy danh sách đơn hàng, bán hàng, trả hàng',
                        2000,
                        'Đóng',
                        'center',
                        'bottom',
                        false,
                    );
                    this.orders.next(this.defaultOrders);
                    this.totalOrder.next(0);
                }
            },
            (error) => {
                this.snackbar.openSnackbar(
                    'Không tìm thấy danh sách đơn hàng, bán hàng, trả hàng',
                    2000,
                    'Đóng',
                    'center',
                    'bottom',
                    false,
                );
                this.orders.next(this.defaultOrders);
                this.totalOrder.next(0);
            },
        );
    }

    restoreOrder(body: any, bodyGet: IBody) {
        this.orderService.unArchive(body).subscribe(
            (data) => {
                if (data && data > 0) {
                    this.getOrder(bodyGet);
                    this.snackbar.openSnackbar('Khôi phục bản ghi thành công', 2000, 'Đóng', 'center', 'bottom', true);
                } else {
                    this.snackbar.openSnackbar('Khôi phục bản ghi thất bại', 2000, 'Đóng', 'center', 'bottom', false);
                }
            },
            (error) => {
                this.snackbar.openSnackbar('Khôi phục bản ghi thất bại', 2000, 'Đóng', 'center', 'bottom', false);
            },
        );
    }

    deleteOrder(body: any, bodyGet: IBody) {
        this.orderService.deleteAll(body).subscribe(
            (data) => {
                if (data && data > 0) {
                    this.getOrder(bodyGet);
                    this.snackbar.openSnackbar('Xóa bản ghi thành công', 2000, 'Đóng', 'center', 'bottom', true);
                } else {
                    this.snackbar.openSnackbar('Xóa bản ghi thất bại', 2000, 'Đóng', 'center', 'bottom', false);
                }
            },
            (error) => {
                this.snackbar.openSnackbar('Xóa bản ghi thất bại', 2000, 'Đóng', 'center', 'bottom', false);
            },
        );
    }
}
