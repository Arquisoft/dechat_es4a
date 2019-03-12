import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SolidChat } from '../models/solid-chat.model';
import { NgForm } from '@angular/forms';
import { SolidProfile } from '../models/solid-profile.model';
import { RdfService } from '../services/rdf.service';
import { AuthService } from '../services/solid.auth.service';

/** import { AuthService } from '../services/solid.auth.service';
import { ChatService } from '../services/chat.service';*/

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  chat: SolidChat;
  /** message: string = '';*/

  /**  constructor(private auth: AuthService, private router: Router, private chat: ChatService) { }*/
  constructor(private router: Router) {
  }

  async ngOnInit() {
    this.router.navigateByUrl('/chat');
    this.chat.clientId = "uo244102";
    this.chat.friendId = "friend";
    this.chat.webUrl = "https://uo244102.solid.community/public/";
    /** 
        try {
          localStorage.setItem('PrototypeChat', JSON.stringify(this.chat));
        } catch (err) {
          console.log(`Error: ${err}`);
        }
      */

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
