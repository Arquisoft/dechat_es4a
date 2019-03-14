import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { RdfService } from '../services/rdf.service';
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

  /** message: string = '';*/
  fileClient: any;
  /**  constructor(private auth: AuthService, private router: Router, private chat: ChatService) { }*/
  constructor(private rdf: RdfService) {
  }

  ngOnInit() {
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
    var user = this.getUsername(id);

    let folder = "/public/prototypeChat";
    id = id.replace(str, folder);

    fileClient.popupLogin().then(webId => {
      console.log(`Logged in as ${webId}.`)
    }, err => console.log(err));
    fileClient.createFolder(id).then(() => {
      console.log(`Created folder ${id}.`);
    }, err => console.log(err));

    //esta url deberia sustituirse por 
    let url = "https://" + user + ".solid.community/public/PrototypeChat/index.ttl#this";
    this.postMessage(new SolidMessage(user, "mensaje de prueba"), url, "uo244102");
  };





  /**
   * 
   * @param msg contenido del mensaje
   * @param url url del index.ttl a modificar. actualmente  este debe ser un chat simple con un mensaje enviado desde la pod en el antes de intentar hacer la operación y debe ser creado manualmente en la pod
   */
  private async postMessage(msg: SolidMessage, url: string, author: string) {

    if (author == this.getUsername(url)) {
      author = "me";
    }



    var chatcontent = "";

    fileClient.readFile(url).then(body => {
      chatcontent = body;
      console.log(chatcontent);
      console.log("---------------------------------------------------------");
      var chatcontentsplit = chatcontent.split(":this");
      var chatcontent1 = chatcontentsplit[0];
      console.log(chatcontentsplit[0]);
      console.log("---------------------------------------------------------");
      var chatcontent2 = chatcontentsplit[1].split(".")[0];
      console.log(chatcontent2);
      console.log("---------------------------------------------------------");


      const msgnb = Math.floor(Math.random() * 10000000000000);
      console.log("numero de mensaje: " + msgnb);
      const d = new Date();
      const message = chatcontent1 + `
        :Msg${msgnb}
            terms:created "'${d.toISOString()}'"^^XML:dateTime;
            n:content "${msg.content}";
            n0:maker c:${author}.
            `+ `:this
            `+ `
             `+ chatcontent2 + `, :Msg${msgnb} .
        `
        ;
      fileClient.deleteFile(url).then(success => {
        console.log(`Deleted ${url}.`);
      }, err => console.log(err));


      fileClient.updateFile(url, message).then(success => {
        console.log('message has been saved');
      }, (err: any) => console.log(err));






    }, err => console.log(err));


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