import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    roles: string;
    listRole: string[] = [];
    isAdmin = false;
    role: string;
    annonimousAvatar = './../../../../assets/images/annonimous.jpg';
    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
      this.role = '' + localStorage.getItem('roleMain');
      this.roles = '' + localStorage.getItem('role');
      this.listRole = this.roles.split(',');
      this.listRole.forEach(element => {
        if(element.includes('SALE_ADMIN')) {
          this.isAdmin = true;
        }
      });
     }

    logout() {
      this.authService.logout();
    }

    openTree() {
        this.router.navigate(['/categories/tree'])
    }
}
