import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: false,
    })
  }

  submit() {
    const body = {
      username: this.loginForm.controls['username'].value,
      password: this.loginForm.controls['password'].value,
      rememberMe: true
    }
    this.auth.Authenticate(body).subscribe(data => {
      this.auth.setToken(data.id_token)
      this.router.navigate([""]);
    })
  }

}
