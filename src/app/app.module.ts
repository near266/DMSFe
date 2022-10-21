import { NgModule, LOCALE_ID } from '@angular/core';
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
import { CurrencyPipe, DatePipe, registerLocaleData } from '@angular/common';
import { DataService } from './core/services/data.service';
import { ForgotpasswordComponent } from './features/auth/forgotpassword/forgotpassword.component';
import { OrderReportComponent } from './features/order-report/order-report.component';
import localeVi from '@angular/common/locales/vi';
registerLocaleData(localeVi);
@NgModule({
    declarations: [AppComponent, ForgotpasswordComponent, OrderReportComponent],
    imports: [SharedModule, RouterModule, BrowserModule, AppRoutingModule, BrowserAnimationsModule, HttpClientModule],
    providers: [
        DatePipe,
        { provide: LOCALE_ID, useValue: 'vi' },
        { provide: HTTP_INTERCEPTORS, useClass: SecretInterceptor, multi: true },
        { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
        DataService,
        CurrencyPipe,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
