import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AsyncPipe, CurrencyPipe, DatePipe, PercentPipe, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import localeVi from '@angular/common/locales/vi';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { SecretInterceptor } from './core/interceptor/secret.interceptor';
import { DataService } from './core/services/data.service';
import { SharedModule } from './core/shared/shared.module';
import { ForgotpasswordComponent } from './features/auth/forgotpassword/forgotpassword.component';
registerLocaleData(localeVi);
@NgModule({
    declarations: [AppComponent, ForgotpasswordComponent],
    imports: [SharedModule, RouterModule, BrowserModule, AppRoutingModule, BrowserAnimationsModule, HttpClientModule],
    providers: [
        DatePipe,
        { provide: LOCALE_ID, useValue: 'vi' },
        { provide: HTTP_INTERCEPTORS, useClass: SecretInterceptor, multi: true },
        { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
        DataService,
        CurrencyPipe,
        PercentPipe,
        AsyncPipe
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
