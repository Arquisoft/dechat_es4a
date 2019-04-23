import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from 'src/app/services/solid.auth.service';
import { RdfService } from 'src/app/services/rdf.service';
import { ChatComponent } from 'src/app/chat/chat.component';
import { stringify } from '@angular/core/src/render3/util';


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

    var cardurl = "https://testfriends.solid.community/profile/card#me";
    this.fileClient.readFile(cardurl).then(body => {
      console.log(body);
      var friendname = "miau"
      var internalnamevar = "addedfriend" + friendname;


      if (body.indexOf('knows') >= 0) {
        // Found know
        var splitbody1 = body.split("pro:card")[0];
        var splitbody2 = body.split("pro:card")[1];
        splitbody2 = `
        @prefix `+ internalnamevar + `: <https://miau.solid.community/profile/card#>.

        pro:card` + splitbody2

        body = splitbody1 + splitbody2;
        splitbody1 = body.split(":knows")[0];
        splitbody2 = body.split(":knows")[1];

        splitbody2 = ":knows " + internalnamevar + ":me ," + splitbody2;
        body = splitbody1 + splitbody2;
        console.log(body);


        this.fileClient.updateFile(cardurl, body).then(success => {
          console.log('friend has been saved');
        }, (err: any) => console.log(err)).catch(error => console.log("File not updated"));
      } else {

        console.log("adding friends to friendless cards not yet implemented, sorry!");



      }







    }, (err: any) => console.log(err)).catch(error => console.log("Unable to read card"));

    /*
        ChatComponent.addfriend("https://albertong.solid.community/profile/card#me");
        console.log("friend added! (all lies, it's not implemented yet)");
      */
  }
}
