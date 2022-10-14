import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    annonimousAvatar = './../../../../assets/images/annonimous.jpg';
    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    ngOnInit(): void { }

    logout() {
      this.authService.logout();
    }

    openTree() {
        this.router.navigate(['/categories/tree'])
    }
}
