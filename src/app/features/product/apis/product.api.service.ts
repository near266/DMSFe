import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Brand, Major, Product, Supplier, Unit, Warehouse } from '../models/product';

@Injectable({
    providedIn: 'root',
})
export class ProductApiService {
    private endPoint = environment.API_URL + '/gw/Catalog';
    private endPointWarehouse = environment.API_URL + '/gw/Warehouse';

    constructor(private http: HttpClient) {}
    //GET
    getAllSuppliers(): Observable<Supplier[]> {
        return this.http.get<Supplier[]>(this.endPoint + '/SupplierGetAll');
    }
    getAllUnits(): Observable<Unit[]> {
        return this.http.get<Unit[]>(this.endPoint + '/UnitGetAll');
    }
    getAllBrands(): Observable<Brand[]> {
        return this.http.get<Brand[]>(this.endPoint + '/BrandGetAll');
    }
    getAllMajors(): Observable<Major[]> {
        return this.http.get<Major[]>(this.endPoint + '/MajorGetAll');
    }
    getAllWarehouses(): Observable<Warehouse[]> {
        return this.http.get<Warehouse[]>(this.endPointWarehouse + '/getAll');
    }
    // GetAll
    getAllProducts(settings: any): Observable<any> {
        return this.http.post<any>(this.endPoint + '/Search', settings).pipe(
            map((res) => {
                const data = res.data.map((data: Product) => {
                    return {
                        ...data,
                        supplierId: data.supplier?.id || null,
                        brandId: data.brand?.id || null,
                        retailUnitId: data.retailUnit?.id || null,
                        wholeSaleUnitId: data.wholeSaleUnit?.id || null,
                        majorId: data.major?.id || null,
                        warehouseId: data.warehouse?.id || null,
                    };
                });
                console.log(data);
                return { ...res, data };
            }),
        );
    }

    get(): Observable<any[]> {
        return this.http.get<any[]>(this.endPoint + '/MajorGetAll');
    }

    // POST
    postProduct(product: Product): Observable<HttpResponse<any>> {
        return this.http.post<HttpResponse<any>>(this.endPoint + '/add', product);
    }

    //PUT
    updateProduct(product: Product): Observable<HttpResponse<any>> {
        return this.http.put<HttpResponse<any>>(this.endPoint + '/update', product);
    }
    archiveProduct(productId: string): any {
        const payload = {
            id: productId,
        };
        return this.http.put<HttpResponse<any>>(this.endPoint + '/arhived', payload);
    }
}
