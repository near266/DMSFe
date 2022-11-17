import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { Channel } from 'src/app/core/model/Channel';
import { environment } from 'src/environments/environment';
import { ChannelComponent } from '../channel/channel.component';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  private totalBranchs: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public totalBranchs$ = this.totalBranchs.asObservable();

  header: BehaviorSubject<string> = new BehaviorSubject<string>('');
  header$: Observable<string> = this.header.asObservable();
  submitForm$: Subject<boolean> = new Subject<boolean>();
  toggleEdit$: Subject<boolean> = new Subject<boolean>();
  open(data: Channel | null = null) {
    const dialogRef = this.dialogService.open(ChannelComponent, {
        width: '730px',
        height: '90vh',
        data,
    });
      dialogRef.afterClosed().subscribe(result => {
        if(result?.event === true){
          // this.getAllBrand();
        }
      });
  }
  changeHeader(value: string) {
    this.header.next(value);
  }

  // private endPoint = environment.API_URL + '/gw/Catalog';
  private Point = environment.API_URL + '/gw/Channel'

  constructor(private http: HttpClient, private dialogService: MatDialog) { }

  getAllChannel(body: any): Observable<any> {
    return this.http.post(this.Point + '/search', body);
  }

  getdetailChannel(id: any): Observable<Channel[]> {
    return this.http.get<Channel[]>(this.Point + '/id?Id=' + id);
  }

  addChannel(body: any): Observable<Channel[]> {
    return this.http.post<Channel[]>(this.Point + '/add', body);
  }

  updateChannel(body: any): Observable<Channel[]> {
    return this.http.put<Channel[]>(this.Point + '/update', body);
  }

  searchChannel(keyword: any): Observable<Channel[]> {
    return this.http.post<Channel[]>(this.Point + '/search', keyword);
  }

  del(body: any): Observable<any> {
    return this.http.delete(this.Point + '/delete', {body}).pipe(map((response: any) => response));
  }

}
