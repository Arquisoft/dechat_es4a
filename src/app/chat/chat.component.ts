import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
/** import { AuthService } from '../services/solid.auth.service';*/
import { ChatService } from '../services/chat.service';
import { RdfService } from '../services/rdf.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  /** message: string = '';*/
  fileClient:any;
 /**  constructor(private auth: AuthService, private router: Router, private chat: ChatService) { }*/
 constructor(private router: Router,private rdf:RdfService) {  }
 
 ngOnInit() {
    this.fileClient = require('solid-file-client');
    this.createInboxChat('https://masterhacker.solid.community/profile/card#me');
  }

  private getUsername(webId: string):string{
    let username = webId.replace('https://', '');
    let user = username.split('.')[0];
    return user;

}

  createInboxChat(friendWebId:string) {
    let id = this.rdf.session.webId;
    let str = "/profile/card#me";
    let user=this.getUsername('https://masterhacker.solid.community/profile/card#me');
    let folder = "/public/" + user;
    id = id.replace(str,folder);

    this.fileClient.popupLogin().then( webId => {
      console.log( `Logged in as ${webId}.`)
    }, err => console.log(err) );

    this.fileClient.createFolder(id).then(success => {
      console.log(`Created folder ${id}.`);
    }, err => console.log(err) );
};

  /** logout(): void{
    
    this.auth.solidSignOut();
    
  }

  send() {
    this.chat.sendMessage(this.message);
    this.message = '';
  }

   handleSubmit(event) {
    if (event.keyCode === 13) {
      this.send();
    }
  }*/

}
