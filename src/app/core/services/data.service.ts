import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class DataService {
  private typeSource = new BehaviorSubject<string>('');
  type = this.typeSource.asObservable()
  private openProductFromSource = new BehaviorSubject<string>('');
  openProductFrom = this.openProductFromSource.asObservable();
  private orderDataStorage = new BehaviorSubject<any>('');
  orderData = this.orderDataStorage.asObservable();
  private statusSource = new BehaviorSubject<any>('');
  status = this.statusSource.asObservable();

  constructor() { }
  changeType(type: string) {
    this.typeSource.next(type);
  }
  openProductList(from: string, order: any) {
    this.openProductFromSource.next(from);
    this.orderDataStorage.next(order);
  }
  passStatus(status: string) {
    this.statusSource.next(status);
  }

}