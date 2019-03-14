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
export class ChatService implements OnInit{

    fileClient:any; 

    chat:SolidChat;

    userID:any;
    friendID:any;

    constructor(private rdf:RdfService){this.fileClient = require('solid-file-client');}
    
    ngOnInit() {
       
       
    }
    
    getUserProfile(webid):SolidProfile{
        var profile : SolidProfile;
        
        profile.fn = this.rdf.getValueFromVcard('fn',webid);
        
        return profile;
    };

    private getUsername(webId: string):string{
        let username = webId.replace('https://', '');
        let user = username.split('.')[0];
        return user;
    
    }

    createInboxChat(submitterWebId:string,destinataryWebId:string) {
     this.userID = submitterWebId;
     this.friendID = destinataryWebId;
    };

    sendMessage(msg: string) {

      var message = new SolidMessage(this.getUsername(this.userID),msg);
  
      this.chat.messages.push(message);
  
      var str = JSON.stringify(msg);
      var path = this.chat.webUrl +"/"+ this.getDate() + ".txt";
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
  async postMessage(msg: SolidMessage, url: string, author: string) {

    if (author == this.getUsername(url)) {
      author = "me";
    }

    var chatcontent = "";

    this.fileClient.readFile(url).then(body => {
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
      this.fileClient.deleteFile(url).then(success => {
        console.log(`Deleted ${url}.`);
      }, err => console.log(err));


      this.fileClient.updateFile(url, message).then(success => {
        console.log('message has been saved');
      }, (err: any) => console.log(err));

    }, err => console.log(err));


  }

  async loadMessages(url: string){
    var chatcontent = "";
    let str = "/profile/card#me";
    let chat = "/public/PrototypeChat/index.ttl#this";
    url.replace(str,chat);    
    
    this.chat = new SolidChat(this.userID,this.friendID,"https://" + this.getUsername(this.userID) + ".solid.community/public/PrototypeChat/index.ttl#this");
    
    this.fileClient.readFile(url).then(body => {
      chatcontent = body;

      var split = chatcontent.split(':Msg');
      split.forEach(async str =>{
        var content = str.split(':content');
        var maker = this.getUsername(this.userID)
        this.chat.messages.push(new SolidMessage(maker,content));
      })
      
    });

    url = "https://" + this.getUsername(this.friendID) + ".solid.community/public/PrototypeChat/index.ttl#this"
   
    this.fileClient.readFile(url).then(body => {
      chatcontent = body;

      var split = chatcontent.split(':Msg');
      split.forEach(async str =>{
        var content = str.split(':content');
        var maker = this.getUsername(this.friendID)
        this.chat.messages.push(new SolidMessage(maker,content));
      })
      
    });

    console.log(chatcontent);
    
    return this.chat;
  }

    

}