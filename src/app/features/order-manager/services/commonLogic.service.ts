import { ifStmt } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { PurchaseOrderService } from 'src/app/core/services/purchaseOrder.service';
import { GroupModel } from '../models/group';
import { Product, ProductSearch } from '../models/product';
import { ListProduct } from '../models/purchaseDetail';

@Injectable({
    providedIn: 'root',
})
export class CommonLogicService {
    listSearchedProduct: Product[] = [];

    private listRouteSource = new BehaviorSubject<any[]>([]);
    private listEmployeeSource = new BehaviorSubject<any[]>([]);
    private listSaleEmployeeSource = new BehaviorSubject<any[]>([]);
    private listCusSource = new BehaviorSubject<any[]>([]);
    private listGroupSource = new BehaviorSubject<GroupModel[]>([]);
    private listProductActiveSource = new BehaviorSubject<Product[]>([]);
    private listProductSource = new BehaviorSubject<ListProduct[]>([]);
    private listPromotionSource = new BehaviorSubject<ListProduct[]>([]);
    private isEditSource = new BehaviorSubject<boolean>(false);
    private isSaveSource = new BehaviorSubject<boolean>(false);
    private isSucessSource = new BehaviorSubject<boolean>(false);
    private isCreateSource = new BehaviorSubject<boolean>(false);
    private searchTextSource = new BehaviorSubject<string>('');
    private routeIdSource = new BehaviorSubject<string>('');

    listRoute$ = this.listRouteSource.asObservable();
    listEmployee$ = this.listEmployeeSource.asObservable();
    listSaleEmployee$ = this.listSaleEmployeeSource.asObservable();
    listCus$ = this.listCusSource.asObservable();
    listGroup$ = this.listGroupSource.asObservable();
    isEdit$ = this.isEditSource.asObservable();
    listProductActive$ = this.listProductActiveSource.asObservable();
    listProduct$ = this.listProductSource.asObservable();
    listPromotion$ = this.listPromotionSource.asObservable();
    isSave$ = this.isSaveSource.asObservable();
    isSucess$ = this.isSucessSource.asObservable();
    isCreate$ = this.isCreateSource.asObservable();
    searchText$ = this.searchTextSource.asObservable();
    routeId$ = this.routeIdSource.asObservable();

    constructor(private purchaseOrder: PurchaseOrderService) {}

    getSearchTextSource() {
        return this.searchTextSource.getValue();
    }

    setSearchTextSource(searchText: string) {
        this.searchTextSource.next(searchText);
    }

    setListEmployeeSource(list: any[]) {
        this.listEmployeeSource.next(list);
    }

    setListSaleEmployeeSource(list: any[]) {
        this.listSaleEmployeeSource.next(list);
    }

    setListRouteSource(list: any[]) {
        this.listRouteSource.next(list);
    }

    create() {
        this.isCreateSource.next(true);
    }

    changeToCreateType() {
        this.isEditSource.next(true);
    }

    changeToEditType() {
        this.isEditSource.next(false);
    }

    clearEditSource() {
        this.isEditSource.next(false);
    }

    successUpdate() {
        this.isSucessSource.next(true);
        this.isSaveSource.next(false);
        this.isEditSource.next(false);
    }

    setCustomerIdToLocalStorage(id: string | null) {
        if (id) {
            localStorage.setItem('customerId', id);
        }
    }

    searchListProductActived(value: any) {
        const body = {
            keyword: value,
            sortBy: {
                property: 'CreatedDate',
                value: true,
            },
            page: 1,
            pageSize: 3,
        };
        this.purchaseOrder.getListProductActived(body).subscribe((data: ProductSearch) => {
            this.listProductActiveSource.next(data.data);
        });
    }

    getListRoute(roleMain: string) {
        this.purchaseOrder.getAllRoute(1, 30, '').subscribe((data: { data: any[]; totalCount: number }) => {
            if (data) {
                this.listRouteSource.next(JSON.parse(JSON.stringify(data.data)));
            }
        });
    }

    // gọi tùy theo role
    getListEmployee(roleMain: string) {
        let idDefault = this.getIdDefault();
        if (roleMain != 'member') {
            this.purchaseOrder.getAllEmployees('', 1, 30).subscribe((data) => {
                this.listEmployeeSource.next(JSON.parse(JSON.stringify(data.data)));
                this.purchaseOrder.getEmployeeById(idDefault).subscribe((data) => {
                    if (data) {
                        this.listEmployeeSource.next([...this.listEmployeeSource.getValue(), data]);
                    }
                });
            });
        } else if (roleMain === 'member') {
            this.purchaseOrder.getEmployeeById(idDefault).subscribe((data) => {
                if (data) {
                    this.listEmployeeSource.next(JSON.parse(JSON.stringify(data)));
                }
            });
        }
    }

    // gọi tùy theo role
    getListSaleEmployee(roleMain: string) {
        let idDefault = this.getIdDefault();
        if (roleMain != 'member') {
            this.purchaseOrder.getAllEmployees('', 1, 30).subscribe((data) => {
                this.listSaleEmployeeSource.next(JSON.parse(JSON.stringify(data.data)));
                this.purchaseOrder.getEmployeeById(idDefault).subscribe((data) => {
                    if (data) {
                        this.listSaleEmployeeSource.next([...this.listSaleEmployeeSource.getValue(), data]);
                    }
                });
            });
        } else if (roleMain === 'member') {
            this.purchaseOrder.getEmployeeById(idDefault).subscribe((data) => {
                if (data) {
                    this.listSaleEmployeeSource.next(JSON.parse(JSON.stringify(data)));
                }
            });
        }
    }

    // gọi tùy theo role
    getIdDefault() {
        return this.parseJwt(localStorage.getItem('access_token')).sid;
    }

    // gọi tùy theo role
    getListCus(roleMain: string) {
        this.purchaseOrder.searchCustomer({ keyword: '', page: 1, pageSize: 30 }).subscribe((data) => {
            this.listCusSource.next(JSON.parse(JSON.stringify(data.data)));
        });
    }

    getListGroup() {
        this.purchaseOrder.getAllGroup(1).subscribe((data) => {
            this.listGroupSource.next(JSON.parse(JSON.stringify(data)));
        });
    }

    parseJwt(token: any) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(
            window
                .atob(base64)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join(''),
        );
        return JSON.parse(jsonPayload);
    }

    changeTypeEdit(value: boolean) {
        this.isEditSource.next(value);
    }

    save() {
        this.isSaveSource.next(true);
    }

    // change groupId -> gọi api set lại listEmployee, saleEmployee, route
    setEmployeeAndRouteWhenChangeGroup(groupId: string) {
        this.purchaseOrder
            .searchEmployeeInGroup('', groupId, 1, 100)
            .pipe(
                map((data) => data.data),
                map((data) => data.map((data: any) => data.employee)),
            )
            .subscribe((data) => {
                this.listEmployeeSource.next(data);
                // this.listSaleEmployeeSource.next(data);
            });
        this.purchaseOrder
            .searchAllRouteByGroupId(groupId)
            .pipe(map((data) => data.list))
            .subscribe((data) => this.listRouteSource.next(data));
    }

    // change orderEmployeeId -> gọi api get ra listRoute và đẩy routeId vào
    setRouteWhenChangeOrderEmployee(orderEmployeeId: string) {
        this.purchaseOrder
            .getRouteAndGroupIdByEmployeeId(orderEmployeeId, 1, 100)
            .pipe(map((data) => data.data))
            .subscribe((data) => {
                if (data) {
                    this.listRouteSource.next(data);
                    this.routeIdSource.next(data[0].id);
                }
            });
    }

    pushCusToListCus(id: string, listCus: any) {
        if (listCus && id) {
            this.purchaseOrder.getCustomerById(id).subscribe((data) => this.listCusSource.next([data, ...listCus]));
        } else if (!listCus && id) {
            this.purchaseOrder.getCustomerById(id).subscribe((data) => this.listCusSource.next([data]));
        } else if (!id) {
            this.listCusSource.next(listCus);
        }
    }

    pushOrderEmployeeToListEmployee(orderEmployeeId: string, listOrderEmployee: any) {
        if (listOrderEmployee && orderEmployeeId) {
            this.purchaseOrder
                .getEmployeeById(orderEmployeeId)
                .subscribe((data) => this.listEmployeeSource.next([data, ...listOrderEmployee]));
        } else if (!listOrderEmployee && orderEmployeeId) {
            this.purchaseOrder
                .getEmployeeById(orderEmployeeId)
                .subscribe((data) => this.listEmployeeSource.next([data]));
        } else if (!orderEmployeeId) {
            this.listEmployeeSource.next(listOrderEmployee);
        }
    }

    pushSaleEmployeeToListEmployee(saleEmployeeId: string, listSaleEmployee: any) {
        if (listSaleEmployee && saleEmployeeId) {
            this.purchaseOrder
                .getEmployeeById(saleEmployeeId)
                .subscribe((data) => this.listSaleEmployeeSource.next([data, ...listSaleEmployee]));
        } else if (!listSaleEmployee && saleEmployeeId) {
            this.purchaseOrder
                .getEmployeeById(saleEmployeeId)
                .subscribe((data) => this.listSaleEmployeeSource.next([data]));
        } else if (!saleEmployeeId) {
            this.listSaleEmployeeSource.next(listSaleEmployee);
        }
    }

    pushRouteToListRoute(routeId: string, listRoute: any[]) {
        if (listRoute && routeId) {
            this.purchaseOrder
                .getRouteById(routeId)
                .subscribe((data) => this.listRouteSource.next([data, ...listRoute]));
        } else if (!listRoute && routeId) {
            this.purchaseOrder.getRouteById(routeId).subscribe((data) => this.listRouteSource.next([data]));
        } else if (!routeId) {
            this.listRouteSource.next(listRoute);
        }
    }

    // format để lôi warehouse.id thành wareHouseId, unit.id thành unitId
    formatUnitIdAndWareHouseId(listProduct: ListProduct[], listPromotion: ListProduct[]) {
        if (listProduct && listPromotion) {
            // SP đặt hàng
            listProduct.forEach((product: any) => {
                product.warehouseId = product.warehouse?.id;
                product.unitId = product.unit?.id;
            });
            this.listProductSource.next(listProduct);
            // SP khuyến mại
            listPromotion.forEach((product: any) => {
                product.warehouseId = product.warehouse?.id;
                product.unitId = product.unit?.id;
            });
            this.listPromotionSource.next(listPromotion);
        }
    }

    // format khi add vào bảng -> dùng được cho cả promotion và product
    formatProductFromCloseDialogAdd(listProdAdd: any, list: any) {
        listProdAdd = listProdAdd.map((product: any) => {
            return {
                product: {
                    id: product.id,
                    sku: product.sku,
                    productName: product.productName,
                    retailPrice: product.retailPrice,
                    price: product.price,
                    vat: product.vat,
                    warehouseId: product?.warehouse?.id,
                    retailUnit: product.retailUnit,
                    wholeSaleUnit: product.wholeSaleUnit,
                },
                unitId: product.retailUnit?.id, // mặc định chọn đvt lẻ
                warehouseId: product?.warehouse?.id, // Mặc định chọn kho chính
                unitPrice: product.retailPrice, // mặc định đơn giá là giá lẻ
                quantity: 0,
                totalPrice: 0,
                discount: 0,
                discountRate: 0,
                note: null,
                type: product.type,
            };
        });
        // filter to remove product available
        let listAvailbleIds = list.map((product: any) => {
            return product?.product?.id;
        });
        listProdAdd = listProdAdd.filter((product: any) => {
            return !listAvailbleIds.includes(product.product?.id);
        });
        return listProdAdd;
    }

    // format khi gửi đi body update cho cả product và promotion
    formatListToSendAPI(list: any, orderType: string, tableType: string, id: string) {
        list = list.map((product: any) => {
            let body: any = {
                productId: product?.product?.id,
                unitId: product.unitId,
                warehouseId: product.warehouseId,
                unitPrice: product.unitPrice,
                quantity: product.quantity,
                totalPrice: tableType === 'Product' ? product.totalPrice : 0,
                discount: tableType === 'Product' ? product.discount : 0,
                discountRate: tableType === 'Product' ? product.discountRate : 0,
                note: product.note,
                type: product.type, // update thì k được thay đổi type product
                index: product.index, // đánh index để phân biệt sản phẩm trùng
            };
            orderType === 'Purchase' ? (body.purchaseOrderId = id) : (body.saleRecieptId = id);
            return body;
        });
        return list;
    }

    // format để gửi đi body add (khi ở màn detail) có thể là type 1 hoặc 2 (tùy xem thêm sản phẩm bình thường hay khuyến mại)
    formatListtAddToSendAPI(list: any, orderType: string, type: number, id: string) {
        list = list.map((product: any) => {
            let body: any = {
                productId: product?.product?.id,
                unitId: product.unitId,
                warehouseId: product.warehouseId,
                unitPrice: product.unitPrice,
                quantity: product.quantity,
                totalPrice: product.totalPrice,
                discount: product.discount,
                discountRate: product.discountRate,
                note: product.note,
                type: type,
            };
            orderType === 'Purchase' ? (body.purchaseOrderId = id) : (body.saleRecieptId = id);
            return body;
        });
        return list;
    }

    // dùng cho cả product và promotion
    formatListRemoveToSentAPI(list: any) {
        return list.map((product: any) => {
            return {
                index: product.index,
            };
        });
    }

    // Khi format khi ở màn create dùng cho cả promotin, product, sale, purchase
    formatListAddToSentApi(listAdd: any, type: number) {
        listAdd = listAdd.map((product: any) => {
            return {
                productId: product?.product?.id,
                productName: product?.product?.productName,
                unitId: product.unitId, // chưa xét trường hợp k có đvt lẻ
                warehouseId: product.warehouseId, // chưa xét trường hợp k có kho mặc định
                unitPrice: product.unitPrice,
                quantity: product.quantity,
                totalPrice: product.totalPrice,
                discount: product.discount,
                discountRate: product.discountRate,
                note: product.note,
                type: type, // 1 là product, 2 là promotion
            };
        });
        return listAdd;
    }

    getBodyUpdateProduct(id: string, typeOrder: string, typeTable: string, list: any) {
        let body: any;
        if (typeOrder === 'Purchase') {
            body = {
                purchaseOrderProducts: [this.formatListToSendAPI(list, typeOrder, typeTable, id)],
            };
        } else {
            body = {
                saleRecieptProducts: [this.formatListToSendAPI(list, typeOrder, typeTable, id)],
            };
        }
        return body;
    }

    getBodyAddProduct(id: string, typeOrder: string, typeTable: string, list: any) {
        if (typeTable === 'Product') {
            this.formatListtAddToSendAPI(list, typeOrder, 1, id);
        } else {
            this.formatListtAddToSendAPI(list, typeOrder, 2, id);
        }
    }
}
