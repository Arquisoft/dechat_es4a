import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { RdfService } from '../services/rdf.service';
import { SolidChat } from '../models/solid-chat.model';
import { SolidMessage } from '../models/solid-message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  /** message: string = '';*/
  fileClient: any;
  /**  constructor(private auth: AuthService, private router: Router, private chat: ChatService) { }*/
  constructor(private rdf: RdfService) {
  }

  ngOnInit() {
    this.fileClient = require('solid-file-client');
    /*
        this.chatfile.clientId = "uo244102"
        this.chatfile.friendId = "friend"
        this.chatfile.webUrl = "https://" + this.chatfile.clientId + ".solid.community/public/prototypeChat"
        */
    this.createInboxChat();
  }

  private getUsername(webId: string): string {
    let username = webId.replace('https://', '');
    let user = username.split('.')[0];
    return user;

  }

  createInboxChat() {
    let id = this.rdf.session.webId;
    let str = "/profile/card#me";

    //   let user = this.getUsername('https://uo244102.solid.community/profile/card#me');
    let folder = "/public/prototypeChat";
    id = id.replace(str, folder);

    this.fileClient.popupLogin().then(webId => {
      console.log(`Logged in as ${webId}.`)
    }, err => console.log(err));
    this.fileClient.createFolder(id).then(() => {
      console.log(`Created folder ${id}.`);
    }, err => console.log(err));

    let url = "https://uo244102.solid.community/public/prototypeChat/index.ttl#this";
    this.fileClient.readFile(url).then(body => {
      console.log(`File content is : ${body}.`);
    }, err => console.log(err));

    let localPath = "..\\Downloaded_file\\";

    /** 
       this.fileClient.downloadFile(localPath, url).then(success => {
         console.log(`Downloaded ${url} to ${localPath}.`);
       }, err => console.log(err));
       */
    this.fileClient.createFile(folder + "index.ttl",
      "@prefix : <#>. @prefix mee: <http://www.w3.org/ns/pim/meeting#>.@prefix ic: <http://www.w3.org/2002/12/cal/ical#>.@prefix XML: <http://www.w3.org/2001/XMLSchema#>.@prefix flow: <http://www.w3.org/2005/01/wf/flow#>.@prefix c: </profile/card#>. @prefix ui: <http://www.w3.org/ns/ui#>.@prefix n0: <http://purl.org/dc/elements/1.1/>." +
      ':id1552479004104 ic:dtstart "2019-03-13T12:10:04Z"^^XML:dateTime; flow:participant c:me; ui:backgroundColor "#daf1d8".' +
      ':this a mee:LongChat; n0:author c:me; n0:created "2019-03-13T12:10:00Z"^^XML:dateTime; n0:title "Chat channel"; flow:participation :id1552479004104; ui:sharedPreferences :SharedPreferences.'
    ).then(fileCreated => {

      console.log(`Created file ${fileCreated}.`);
    }, err => console.log(err));
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



