import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map, Observable, pipe } from 'rxjs';
import { api_url } from '../const/url';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  Authenticate(body: any): Observable<any> {
    return this.http.post(api_url + '/authenticate', body)
      .pipe(
        map((response: any) => response)
      )
  }

  setToken(token: string) {
    localStorage.setItem("access_token", token)
  }

  setRoles(role: string) {
    localStorage.setItem("role", role);
  }

  isLoggednIn() {
    return localStorage.getItem('access_token') != null
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }

}
