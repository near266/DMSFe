import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    annonimousAvatar = './../../../../assets/images/annonimous.jpg';
    constructor(
        private router: Router
    ) { }

    ngOnInit(): void { }

    openTree() {
        this.router.navigate(['/categories/tree'])
    }
}
