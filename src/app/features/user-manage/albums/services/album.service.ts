import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { Album } from 'src/app/core/model/Album';
import { environment } from 'src/environments/environment';
import { AlbumComponent } from '../album/album.component';
import { TypeExport } from '../../common/common.service';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  private totalAlbums: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public totalAlbums$ = this.totalAlbums.asObservable();

  header: BehaviorSubject<string> = new BehaviorSubject<string>('');
  header$: Observable<string> = this.header.asObservable();
  submitForm$: Subject<boolean> = new Subject<boolean>();
  toggleEdit$: Subject<boolean> = new Subject<boolean>();
  open(data: Album | null = null) {
    const dialogRef = this.dialogService.open(AlbumComponent, {
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

  private Point = environment.API_URL + '/gw/Album'

  constructor(private http: HttpClient, private dialogService: MatDialog) { }

  getAllAlbum(body: any): Observable<any> {
    return this.http.post(this.Point + '/search', body);
  }

  getdetailAlbum(id: any): Observable<Album[]> {
    return this.http.get<Album[]>(this.Point + '/id?Id=' + id);
  }

  addAlbum(body: any): Observable<Album[]> {
    return this.http.post<Album[]>(this.Point + '/add', body);
  }

  updateAlbum(body: any): Observable<Album[]> {
    return this.http.put<Album[]>(this.Point + '/update', body);
  }

  searchAlbum(keyword: any): Observable<any> {
    return this.http.post<Album[]>(this.Point + '/search', keyword);
  }

  del(body: any): Observable<any> {
    return this.http.delete(this.Point + '/delete', {body}).pipe(map((response: any) => response));
  }
 exportAlbum(type: number, data: any) :Observable<any>{
  let body: any = {
    type: type,
};
if (type === TypeExport.Selected) {
    body.listId = data;
} else {
    body.filter = data;
}
return this.http.post(this.Point + '/export', body, { responseType: 'blob' });
 }

}
