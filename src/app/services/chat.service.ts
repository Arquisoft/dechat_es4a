import { Injectable, OnInit } from '@angular/core';
import { RdfService } from './rdf.service';
import { SolidProfile } from '../models/solid-profile.model';
import { SolidSession } from '../models/solid-session.model';
import { SolidMessage } from '../models/solid-message.model';
import { SolidChat } from '../models/solid-chat.model';
import { forEach } from '@angular/router/src/utils/collection';
import {escapeRegExp} from 'tslint/lib/utils';

declare let solid: any;

@Injectable({
  providedIn: 'root',
})
export class ChatService implements OnInit {
  


  fileClient: any;

  chat: SolidChat;

  userID: any;
  friendID: any;
  chatfriendUrl: any;
  chatuserUrl: any;
  basechat: any;

  constructor(private rdf: RdfService) { this.fileClient = require('solid-file-client'); }

  ngOnInit() { }

  getUserProfile(webid): SolidProfile {
    var profile: SolidProfile;

    profile.fn = this.rdf.getValueFromVcard('fn', webid);

    return profile;
  };

  private getUsername(webId: string): string {
    let username = webId.replace('https://', '');
    let user = username.split('.')[0];

    return user;

  }

  createInboxChat(submitterWebId: string, destinataryWebId: string) {

    var d = new Date().toISOString();
    this.userID = submitterWebId;
    this.friendID = destinataryWebId;
    this.chat = new SolidChat(this.userID,this.friendID);
    this.chatfriendUrl = "https://" + this.getUsername(this.friendID) + ".solid.community/public/Chat" + this.getUsername(this.userID) + "/"
    this.chatuserUrl = "https://" + this.getUsername(this.userID) + ".solid.community/public/Chat" + this.getUsername(this.friendID) + "/"
    this.basechat = `@prefix : <#>.
@prefix mee: <http://www.w3.org/ns/pim/meeting#>.
@prefix terms: <http://purl.org/dc/terms/>.
@prefix XML: <http://www.w3.org/2001/XMLSchema#>.
@prefix n: <http://rdfs.org/sioc/ns#>.
@prefix n0: <http://xmlns.com/foaf/0.1/>.
@prefix c: </profile/card#>.
@prefix n1: <http://purl.org/dc/elements/1.1/>.
@prefix flow: <http://www.w3.org/2005/01/wf/flow#>.

:Msg0000000000001
    terms:created "${d}"^^XML:dateTime;
    n:content "Chat Started";
    n0:maker c:me.
:this
    a mee:Chat;
    n1:author c:me;
    n1:created "${d}"^^XML:dateTime;
    n1:title "Chat";
    flow:message :Msg0000000000001.
                     
    `
    this.createBaseChat(this.chatuserUrl);
  };

  /**
 * 
 * @param msg contenido del mensaje
 * @param url url del index.ttl a modificar. actualmente  este debe ser un chat simple con un mensaje enviado desde la pod en el antes de intentar hacer la operación y debe ser creado manualmente en la pod
 */
  async postMessage(msg: SolidMessage) {
    var author = "me";
    var urlfile = this.chatuserUrl + "index.ttl#this";
    if (this.userID == msg.authorId) {
      // urlfile = this.chatuserUrl + "index.ttl#this";
      // author = "me";
    }

    var chatcontent = "";

    this.fileClient.readFile(urlfile).then(body => {
      chatcontent = body;
      console.log(chatcontent);
      console.log("---------------------------------------------------------");
      var chatcontentsplit = chatcontent.split(":this");
      var chatcontent1 = chatcontentsplit[0];
      console.log(chatcontentsplit[0]);
      console.log("---------------------------------------------------------");
      var chatcontent2 = chatcontentsplit[1].split("flow:message")[0];
      console.log(chatcontent2);
      console.log("---------------------------------------------------------");
      var chatcontent3 = chatcontentsplit[1].split("flow:message")[1];
      console.log(chatcontent3);
      console.log("---------------------------------------------------------");
      const d = new Date();



      var dm
      if (d.getMonth() < 10) {
        dm = "0" + d.getMonth()
      } else {
        dm = d.getMonth();
      }
      const msgnb = d.getFullYear().toString() + dm + d.getDate() + d.getHours() + d.getMinutes() + d.getSeconds() + 0;

      console.log("numero de mensaje: " + msgnb);

      const message = chatcontent1 + `
        :Msg${msgnb}
            terms:created "${d.toISOString()}"^^XML:dateTime;
            n:content "${msg.content}";
            n0:maker c:${author}.
            `+ `:this
            `+ `
             `+ chatcontent2 + `flow:message ` + `:Msg${msgnb} ,` + chatcontent3

      this.fileClient.updateFile(urlfile, message).then(success => {
        console.log('message has been saved');
      }, (err: any) => console.log(err));

    }, err => this.createBaseChat(this.chatuserUrl));
  }

  createBaseChat(url: String) {
    this.fileClient.readFile(url + "index.ttl#this").then(body => {
      console.log('-----------------------------------------------------');
      console.log('Chat exists, no action needed');
      console.log('-----------------------------------------------------');
    }, err =>
        this.fileClient.createFolder(url).then(success => {
          console.log('Folder Created');
          this.fileClient.createFile(url + "index.ttl#this").then(fileCreated => {
            this.fileClient.updateFile(fileCreated, this.basechat).then(success => {
              console.log('chat has been started');
            }, (err: any) => console.log(err));
          }, err => console.log(err));
        }, err => console.log(err)));
  }

  async loadMessages(user,friend) {
    await this.getMessagesFromPOD(user);
    await this.getMessagesFromPOD(friend);

    return this.chat;
  }

  resetChat(){
    this.chat = new SolidChat(this.userID,this.friendID);
  }

  getMessagesFromPOD(url){
    var chatcontent: any;
    

    console.log("loadMessages url: " + url);

    this.fileClient.readFile(url).then(body => {
      chatcontent = body;

      var split = chatcontent.split(':Msg');

      split.forEach(async str => {
        var content = str.substring(str.indexOf("n:content"), str.indexOf("\";"));
        var maker = this.getUsername(url);
        var time_not_parsed = str.substring(str.indexOf("terms:created "), str.indexOf("^^XML:dateTime;"));
        var time_array = time_not_parsed.split("T").join(".").split(".");
        var time = time_array[0]+ " "+ time_array[1];
        this.addToChat(content, maker,time);
      })
    });

  }

  private addToChat(msg: string, maker: string,time = "") {
    let content = msg.substring(msg.indexOf("\"") + 1);
    
    let message;
    
    message = new SolidMessage(maker, content,time);
    if(content != "" && content.length > 0 && content != "Chat Started"){
      this.chat.messages.push(new SolidMessage(escapeRegExp(maker), escapeRegExp(content), time));
    }

  }

}
