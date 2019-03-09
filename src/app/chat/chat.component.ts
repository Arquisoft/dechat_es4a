import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
/** import { AuthService } from '../services/solid.auth.service';
import { ChatService } from '../services/chat.service';*/

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  /** message: string = '';*/

 /**  constructor(private auth: AuthService, private router: Router, private chat: ChatService) { }*/
 constructor(private router: Router) { }
 
 ngOnInit() {
    this.router.navigateByUrl('/chat');
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
