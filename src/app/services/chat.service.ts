import { Injectable, OnInit } from '@angular/core';
import { RdfService } from './rdf.service';
import { SolidProfile } from '../models/solid-profile.model';
import { SolidSession } from '../models/solid-session.model';
import { SolidMessage } from '../models/solid-message.model';
import { SolidChat } from '../models/solid-chat.model';
import { forEach } from '@angular/router/src/utils/collection';

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

  ngOnInit() {


  }

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

  sendMessage(msg: string) {

    var message = new SolidMessage(this.getUsername(this.userID), msg);

    this.chat.messages.push(message);

    var str = JSON.stringify(msg);
    var path = this.chat.webUrl + "/" + this.getDate() + ".txt";
    this.fileClient.updateFile(path, str);

    console.log("[Message sent] : " + msg);
  }


  private getDate() {
    const now = new Date();

    const date = now.getUTCFullYear() + '-' +
      (now.getUTCMonth() + 1) + '-' +
      now.getUTCDate();

    return date;
  }


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
      //const msgnb = Math.floor(Math.random() * 10000000000000);

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




  async loadMessages(url: String) {

    var chatcontent: any;
    this.chat = new SolidChat(this.userID, this.friendID, url);

    console.log(url);






    this.fileClient.readFile(url).then(body => {
      chatcontent = body;

      var split = chatcontent.split(':Msg');

      split.forEach(async str => {
        var content = str.substring(str.indexOf("n:content"), str.indexOf("\";"));
        var maker = this.getUsername(this.userID);
        this.addToChat(content, maker);
      })
    });


    console.log(this.chatfriendUrl + "index.ttl#this");
    this.fileClient.readFile(this.chatfriendUrl + "index.ttl#this").then(body => {
      chatcontent = body;

      var splitFriend = chatcontent.split(':Msg');
      splitFriend.forEach(async string => {
        var contentFriend = string.substring(string.indexOf("n:content"), string.indexOf("\";"));
        var maker = this.getUsername(this.friendID);
        this.addToChat(contentFriend, maker);
      })

    });

    await this.fileClient.readFile(this.chatfriendUrl + "index.ttl#this").then(body => {
      console.log(`File content is : ${body}.`);
    }, err => console.log(err));

    return this.chat;
  }

  private addToChat(msg: string, maker: string) {
    let content = msg.substring(msg.indexOf("\"") + 1);
    console.log(content);
    this.chat.messages.push(new SolidMessage(maker, content));
  }



}
