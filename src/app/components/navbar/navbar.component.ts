import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from 'src/app/services/solid.auth.service';
import { RdfService } from 'src/app/services/rdf.service';
import { ChatComponent } from 'src/app/chat/chat.component';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  fileClient: any;
  constructor(private router: Router, private auth: AuthService, private rdf: RdfService) {
    this.fileClient = require('solid-file-client');

  }

  ngOnInit() {
  }

  getUsername(): string {
    try {
      let id = this.rdf.session.webId;
      let username = id.replace('https://', '');
      let user = username.split('.')[0];
      return user;
    }
    catch (error) {
      console.log(`Error webId: ${error}`);
    }
  }

  goToChat() {
    this.router.navigateByUrl('/chat');
  }

  logout() {
    this.auth.solidSignOut();
  }
  addFriend() {

    this.fileClient.readFile("https://testfriends.solid.community/profile/card#me").then(body => {
      console.log(body);
    }, (err: any) => console.log(err)).catch(error => console.log("Unable to read card"));

    /*
        ChatComponent.addfriend("https://albertong.solid.community/profile/card#me");
        console.log("friend added! (all lies, it's not implemented yet)");
      */
  }
}
