import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { WarehousesService } from 'src/app/core/services/warehouses.service';
import { IBodySearch } from '../models/BodySearch';
import { Warehouse } from '../models/warehouse';

@Injectable({
  providedIn: 'root'
})
export class LogicService {

  private readonly defaultWarehouses: Warehouse[] = [];
  private readonly defaultBodySearch: IBodySearch = {
    keyword: null,
    status: null
  }

  private warehouses: BehaviorSubject<Warehouse[]> = new BehaviorSubject<Warehouse[]>(this.defaultWarehouses);
  private totalCountWarehouse: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public warehouses$ = this.warehouses.asObservable();
  public totalCountWarehouse$ = this.totalCountWarehouse.asObservable();

  public bodySearch: IBodySearch = this.defaultBodySearch;

  constructor(
    private warehouse: WarehousesService,
    public snackbar: SnackbarService
    ) { }

  getAllWareHouse() {
    const body: IBodySearch = {
      keyword: null,
      status: null
    }
    this.bodySearch = body;
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

  deleteWareHouse(list: string[]) {
    const body = {
      id: list
    };
    let sub = this.warehouse.deleteWareHouse(body).subscribe(data => {
      if(data) {
        if(data.message > 0) {
          this.snackbar.openSnackbar('Xóa kho hàng thành công', 2000, 'Đóng', 'center', 'bottom', true);
          this.searchWarehouse(this.bodySearch);
        } else {
          this.snackbar.openSnackbar('Xóa kho hàng thất bại', 2000, 'Đóng', 'center', 'bottom', false);
        }
      } else {
        this.snackbar.openSnackbar('Xóa kho hàng thất bại', 2000, 'Đóng', 'center', 'bottom', false);
      }
      sub.unsubscribe();
    }, (error) => {
      this.snackbar.openSnackbar('Xóa kho hàng thất bại', 2000, 'Đóng', 'center', 'bottom', false);
      sub.unsubscribe();
    });
  }
}
