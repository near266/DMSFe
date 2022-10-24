import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { api_gateway_url } from 'src/app/core/const/url';
import { AuthService } from 'src/app/core/services/auth.service';
import { RolesService } from 'src/app/core/services/roles.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;

    downloadForAndroid = api_gateway_url + '/InstallLink/android';
    downloadForIOS =
        'itms-services://?action=download-manifest&amp;url=' + api_gateway_url + '/InstallLink/fitolabs_manifest.plist';

    constructor(private fb: FormBuilder, private router: Router, private auth: AuthService,private rolesService:  RolesService, private sanitizer: DomSanitizer) {}

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            rememberMe: false,
        });
    }

    submit() {
        const body = {
            username: this.loginForm.controls['username'].value,
            password: this.loginForm.controls['password'].value,
            rememberMe: true,
        };
        this.auth.Authenticate(body).subscribe((data) => {
            this.auth.setToken(data.id_token);
            this.auth.setRoles(data.role);
            this.router.navigate(['/orders']);
        this.rolesService.fetchRoles()

        });
    }

    getSafe() {
      return this.sanitizer.bypassSecurityTrustUrl(this.downloadForIOS);
    }
}
