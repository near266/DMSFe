import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './core/shared/shared.module';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SecretInterceptor } from './core/interceptor/secret.interceptor';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { DataService } from './core/services/data.service';
import { ForgotpasswordComponent } from './features/auth/forgotpassword/forgotpassword.component';
@NgModule({
    declarations: [AppComponent, ForgotpasswordComponent],
    imports: [SharedModule, RouterModule, BrowserModule, AppRoutingModule, BrowserAnimationsModule, HttpClientModule],
    providers: [
        DatePipe,
        { provide: HTTP_INTERCEPTORS, useClass: SecretInterceptor, multi: true },
        { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
        DataService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
