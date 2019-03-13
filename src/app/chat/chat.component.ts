import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
/** import { AuthService } from '../services/solid.auth.service';*/
import { ChatService } from '../services/chat.service';
import { RdfService } from '../services/rdf.service';
import { AuthService } from '../services/solid.auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  /** message: string = '';*/

  
  constructor(private auth: AuthService, private router: Router, private chat: ChatService,private rdf:RdfService) { }
 /** constructor(private router: Router,private rdf:RdfService) {  } */
 
  ngOnInit() {
    this.chat =  new ChatService(this.rdf);
    this.createInboxChat(this.rdf.session.webId,'https://masterhacker.solid.community/profile/card#me');
  }
  createInboxChat(submitterWebId:string,destinataryWebId:string): any {
   this.chat.createInboxChat(submitterWebId,destinataryWebId);
  }

/**  private getUsername(webId: string):string{
    let username = webId.replace('https://', '');
    let user = username.split('.')[0];
    return user;

} */

/**  createInboxChat(submitterWebId:string,destinataryWebId:string) {
    let str = "/profile/card#me";
    let user=this.getUsername(destinataryWebId);
    let folder = "/public/" + user;
    submitterWebId = submitterWebId.replace(str,folder);

    this.fileClient.popupLogin().then( webId => {
      console.log( `Logged in as ${webId}.`)
    }, err => console.log(err) );

    this.fileClient.createFolder(submitterWebId).then(success => {
      console.log(`Created folder ${submitterWebId}.`);
    }, err => console.log(err) );
};
*/

  /** logout(): void{
    
    this.auth.solidSignOut();
    
  }*/

  send() {
   /** this.chat.sendMessage(this.message);
    this.message = '';
    */ 
   this.createInboxChat('https://masterhacker.solid.community/profile/card#me',this.rdf.session.webId);
  }

  /** handleSubmit(event) {
    if (event.keyCode === 13) {
      this.send();
    }
  }*/

}
