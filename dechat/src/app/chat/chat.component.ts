import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {RdfService} from '../services/rdf.service';


/** import { AuthService } from '../services/solid.auth.service';
import { ChatService } from '../services/chat.service';*/

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
    amigos = [];
  /** message: string = '';*/

 /**  constructor(private auth: AuthService, private router: Router, private chat: ChatService) { }*/
 constructor(private router: Router, private rdf: RdfService) { }
 
 ngOnInit() {
    this.router.navigateByUrl('/chat');
    this.loadFriends();
  }
  loadFriends(){
      const list_friends = this.rdf.getFriends();

      if (list_friends) {
          console.log(list_friends);
          let i = 0;
          this.amigos = list_friends;
      }
  }


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
