import { Component } from '@angular/core';
import { popupLogin } from 'solid-auth-client/dist-lib/solid-auth-client.bundle.js';
import { fadeAnimation } from './animations';

import {
  transition,
  trigger,
  query,
  style,
  animate,
  group,
  animateChild
} from '@angular/animations';


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
            style({ position: 'fixed',opacity:0 }),
            animate('400ms ease-in-out', style({ opacity:1 }))
          ]),
          query(':leave', [
            style({ position: 'fixed', opacity:1 }),
            animate('400ms ease-in-out', style({ opacity:0 }))]),
        ])
      ])
    ])
    
      ] // register the animations
})
export class AppComponent {
  title = 'app';
}
