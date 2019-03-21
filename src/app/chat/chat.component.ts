import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import {Router} from "@angular/router";
/** import { AuthService } from '../services/solid.auth.service';*/
import { ChatService } from '../services/chat.service';
import { RdfService } from '../services/rdf.service';
import { AuthService } from '../services/solid.auth.service';
import { SolidChat } from '../models/solid-chat.model';
import { SolidMessage } from '../models/solid-message.model';
import { getLocaleDateFormat } from '@angular/common';
import * as fileClient from 'solid-file-client';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  amigos = [];
  namesFriends=[];
  profileImage: string;
  
  constructor(private rdf: RdfService,private chat:ChatService,private renderer:Renderer2, private auth: AuthService,
    private router: Router) {
  }
  
  ngOnInit(): void {
    this.chat.createInboxChat(this.rdf.session.webId,"https://albertong.solid.community/profile/card#me");
    this.loadMessages();
    this.loadProfile();
    this.loadFriends();
    this.getNamesFriends();
  }

  loadFriends(){
      const list_friends = this.rdf.getFriends();
      if (list_friends) {
          console.log(list_friends);
          let i = 0;
          this.amigos = list_friends;
      }
  }

  getNamesFriends(){
    let i = 0;
    for(i = 0; i < this.amigos.length; i++){
      let username = this.amigos[i].replace('https://', '');
      let user = username.split('.')[0];
      this.namesFriends.push(user);
    }
  }

  /** message: string = '';*/
  fileClient: any;
  messages : Array<String> = new Array();
  
  @ViewChild('chatbox') chatbox:ElementRef;
 
  createInboxChat(submitterWebId:string,destinataryWebId:string): any {
   this.chat.createInboxChat(submitterWebId,destinataryWebId);
  }

  send() {
    var content = (<HTMLInputElement>document.getElementById("message")).value;
    let user = this.getUsername();
    let url = "https://" + user + ".solid.community/public/PrototypeChat/index.ttl#this";
    let message = new SolidMessage(user, content)
    this.chat.postMessage(message, url, user);
    (<HTMLInputElement>document.getElementById("message")).value = "";
    this.messages.push(message.authorId + ':' + message.content);
  }

  handleSubmit(event) {
    if (event.keyCode === 13) {
      this.send();
    }
  }

 getUsername(): string {
    let id = this.rdf.session.webId;
    let username = id.replace('https://', '');
    let user = username.split('.')[0];
    return user;
  }

  private async loadMessages(){
    var chat = await this.chat.loadMessages(this.getUsername());
    chat.messages.forEach(message => {
      if(message.content && message.content.length > 0){
        this.messages.push(message.authorId + ': '+message.content);
        console.log(message.content);
      }
    });
  }
  
  logout() {
    this.auth.solidSignOut();
  }

  goToChat() {
    this.router.navigateByUrl('/chat');
  }
  
  private setupProfileData() {
    this.profileImage = '/assets/images/profile.png';
  }
  
  async loadProfile() {
    try {
      this.setupProfileData();
    } catch (error) {
      console.log(`Error: ${error}`);
    }

  }
  
}


/**
 * ejemplo de un chat de pod normal:
 *
@prefix : <#>.
@prefix mee: <http://www.w3.org/ns/pim/meeting#>.
@prefix terms: <http://purl.org/dc/terms/>.
@prefix XML: <http://www.w3.org/2001/XMLSchema#>.
@prefix n: <http://rdfs.org/sioc/ns#>.
@prefix n0: <http://xmlns.com/foaf/0.1/>.
@prefix c: </profile/card#>.
@prefix n1: <http://purl.org/dc/elements/1.1/>.
@prefix flow: <http://www.w3.org/2005/01/wf/flow#>.

:Msg1552577190108
    terms:created "2019-03-14T15:26:30Z"^^XML:dateTime;
    n:content "1\n";
    n0:maker c:me.
:Msg1552577190972
    terms:created "2019-03-14T15:26:30Z"^^XML:dateTime;
    n:content "2\n";
    n0:maker c:me.
:this
    a mee:Chat;
    n1:author c:me;
    n1:created "2019-03-14T15:26:06Z"^^XML:dateTime;
    n1:title "Chat";
    flow:message :Msg1552577190108, :Msg1552577190972.

 */