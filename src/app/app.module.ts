import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './core/shared/shared.module';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SecretInterceptor } from './core/interceptor/secret.interceptor';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
    declarations: [AppComponent],
    imports: [SharedModule, RouterModule, BrowserModule, AppRoutingModule, BrowserAnimationsModule],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: SecretInterceptor, multi: true },
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
