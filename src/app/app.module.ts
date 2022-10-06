import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './core/shared/shared.module';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SecretInterceptor } from './core/interceptor/secret.interceptor';
import { LoginComponent } from './features/auth/login/login.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
      SharedModule,
      RouterModule,
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: SecretInterceptor, multi: true },],
    bootstrap: [AppComponent],
})
export class AppModule {}
