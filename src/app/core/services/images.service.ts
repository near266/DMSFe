import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { uploadImg_url } from '../const/url';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(private http: HttpClient) { }

  uploadImg(file: any): Observable<any> {
    const formData: FormData = new FormData();
    for (let i = 0; i < file.length; i++) {
      const fileName = new Date().getTime() + file[i].name.split(' ').join('');
      formData.append('file', file[i], fileName);
    }
    return this.http
      .post(uploadImg_url + '/Upload', formData)
      .pipe(map((res) => res));
  }
}
