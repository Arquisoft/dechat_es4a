import { Component, ViewEncapsulation } from '@angular/core';
import { popupLogin } from 'solid-auth-client/dist-lib/solid-auth-client.bundle.js';
import { NavbarComponent } from './components/navbar/navbar.component';
import {
  transition,
  trigger,
  query,
  style,
  animate,
  group
} from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './services/solid.auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('myAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [style({ position: 'fixed', opacity: 1 })],
          { optional: true }
        ),
        group([
          query(':enter', [
            style({ position: 'fixed', opacity: 0 }),
            animate('400ms ease-in-out', style({ opacity: 1 }))
          ], { optional: true }),
          query(':leave', [
            style({ position: 'fixed', opacity: 1 }),
            animate('400ms ease-in-out', style({ opacity: 0 }))], { optional: true }),
        ])
      ])
    ])
  ] // register the animations
  ,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'app';
  public inLogin;

  constructor(private _router: ActivatedRoute, private auth: AuthService) {
    if (localStorage.getItem('solid-auth-client') == null) {
      this.inLogin = true;
    }
    else {
      this.inLogin = false;
    }
  }

}
