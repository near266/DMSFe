import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Unit } from 'src/app/features/product/models/product';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  private endPoint = environment.API_URL + '/gw/Catalog';

  constructor(private http: HttpClient) { }

  getAllUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(this.endPoint + '/UnitGetAll');
  }

}
