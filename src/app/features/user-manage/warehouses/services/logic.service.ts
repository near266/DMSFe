import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { WarehousesService } from 'src/app/core/services/warehouses.service';
import { IBodySearch } from '../models/Body';
import { Warehouse } from '../models/warehouse';

@Injectable({
  providedIn: 'root'
})
export class LogicService {

  private readonly defaultWarehouses: Warehouse[] = [];

  private warehouses: BehaviorSubject<Warehouse[]> = new BehaviorSubject<Warehouse[]>(this.defaultWarehouses);
  private totalCountWarehouse: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public warehouses$ = this.warehouses.asObservable();
  public totalCountWarehouse$ = this.totalCountWarehouse.asObservable();

  constructor(
    private warehouse: WarehousesService,
    public snackbar: SnackbarService
    ) { }

  getAllWareHouse() {
    const body: IBodySearch = {
      keyword: null,
      status: null
    }
    let subscription = this.warehouse.search(body).subscribe((response: Warehouse[]) => {
      if(response) {
        this.warehouses.next(response);
        this.totalCountWarehouse.next(response.length);
      } else {
        this.snackbar.openSnackbar('Không thể tải danh sách kho hàng', 2000, 'Đóng', 'center', 'bottom', false);
      }
      subscription.unsubscribe();
    }, (error) => {
      this.snackbar.openSnackbar('Không thể tải danh sách kho hàng', 2000, 'Đóng', 'center', 'bottom', false);
      subscription.unsubscribe();
    });
  }

  searchWarehouse(body: IBodySearch) {
    if(body.keyword) {
      body.keyword = body.keyword.trim();
    }
    let subscription = this.warehouse.search(body).subscribe((response: Warehouse[]) => {
      if(response) {
        this.warehouses.next(response);
        this.totalCountWarehouse.next(response.length);
      } else {
        this.snackbar.openSnackbar('Không thể tải danh sách kho hàng', 2000, 'Đóng', 'center', 'bottom', false);
      }
      subscription.unsubscribe();
    }, (error) => {
      this.snackbar.openSnackbar('Không thể tải danh sách kho hàng', 2000, 'Đóng', 'center', 'bottom', false);
      subscription.unsubscribe();
    });
  }
}
