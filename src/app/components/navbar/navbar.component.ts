import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { AuthService } from 'src/app/services/solid.auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router,private auth: AuthService) { }

  ngOnInit() {
  }

  goToChat() {
    this.router.navigateByUrl('/chat');
  }

  logout() {
    this.auth.solidSignOut();
  }

}
