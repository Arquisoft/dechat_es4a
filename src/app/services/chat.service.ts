import { Injectable, OnInit } from '@angular/core';
import { RdfService } from './rdf.service';
import { SolidProfile } from '../models/solid-profile.model';
import { SolidSession } from '../models/solid-session.model';
import { SolidMessage } from '../models/solid-message.model';
import { SolidChat } from '../models/solid-chat.model';
/*import { forEach } from '@angular/router/src/utils/collection';
import { bloomFindPossibleInjector } from '@angular/core/src/render3/di';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';*/

declare let solid: any;

@Injectable({
  providedIn: 'root',
})
export class ChatService implements OnInit {



  fileClient: any;

  chat: SolidChat;

  userID: any;
  friendID: string;
  chatfriendUrl: any;
  chatuserUrl: any;
  basechat: any;
  baseAcl: any;

  constructor(private rdf: RdfService) { this.fileClient = require('solid-file-client'); }

  ngOnInit() { }

  getUserProfile(webid): SolidProfile {
    var profile: SolidProfile;

    profile.fn = this.rdf.getValueFromVcard('fn', webid);

    return profile;
  };

  getUsername(webId: string): string {
    let username = webId.replace('https://', '');
    let user = username.split('.')[0];

    return user;

  }

  createInboxChat(submitterWebId: string, destinataryWebId: string) {

    var d = new Date().toISOString(); //esto es la fecha de creacion
    this.userID = submitterWebId;
    this.friendID = destinataryWebId;
    this.chat = new SolidChat(this.userID, this.friendID);
    this.chatfriendUrl = "https://" + this.getUsername(this.friendID) + ".solid.community/private/Chat" + this.getUsername(this.userID) + "/"
    this.chatuserUrl = "https://" + this.getUsername(this.userID) + ".solid.community/private/Chat" + this.getUsername(this.friendID) + "/"
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

    //Lee el ttl:
    this.fileClient.readFile(urlfile).then(body => {
      chatcontent = body;
      //console.log(chatcontent);
      //console.log("---------------------------------------------------------");
      var chatcontentsplit = chatcontent.split(":this");
      var chatcontent1 = chatcontentsplit[0];
      //console.log(chatcontentsplit[0]);
      //console.log("---------------------------------------------------------");
      var chatcontent2 = chatcontentsplit[1].split("flow:message")[0];
      //console.log(chatcontent2);
      //console.log("---------------------------------------------------------");
      var chatcontent3 = chatcontentsplit[1].split("flow:message")[1];
      //console.log(chatcontent3);
      //console.log("---------------------------------------------------------");
      const d = new Date();

      var dm
      if (d.getMonth() < 10) {
        dm = "0" + d.getMonth()
      } else {
        dm = d.getMonth();
      }
      //Decidimos un numero en base a la fecha para que no haya mensajes repetidos
      const msgnb = d.getFullYear().toString() + dm + d.getDate() + d.getHours() + d.getMinutes() + d.getSeconds() + 0;

      //console.log("numero de mensaje: " + msgnb);

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
      }, (err: any) => console.log(err)).catch(error => console.log("File not updated"));

    }, err => this.createBaseChat(this.chatuserUrl)).catch(error => console.log("Not able to read file"));
  }

  async removeMessage(msg: SolidMessage) {
    var urlfile = this.chatuserUrl + "index.ttl#this";
    var chatcontent = "";
    this.fileClient.readFile(urlfile).then(body => {
      chatcontent = body;
      var chatcontentsplit = chatcontent.split(":this");
      var chatcontent2 = chatcontentsplit[1].split("flow:message"); //es la parte de flow:message
      var chatcontent3 = chatcontentsplit[0].split("n0:maker c:me.");
      let nameMessage; //name of the message
      for (let i = 1; i < chatcontent3.length; i++) {
        let value = chatcontent3[i]
        let valueMsg = msg.content
        value = chatcontent3[i].replace(/\s/g, '');
        valueMsg = msg.content.replace(/\s/g, '');
        if (value.includes(valueMsg)) {
          nameMessage = value.split("terms:created")[0];
          nameMessage = nameMessage.replace(/\s/g, '');
        }
      }
      let message = chatcontent3[0] + "n0:maker c:me.";
      for (let i = 1; i < chatcontent3.length; i++) {
        if (!chatcontent3[i].includes(msg.content)) {
          message += chatcontent3[i];
          if (i < chatcontent3.length - 1) {
            message += "n0:maker c:me.";
          }
        }
      }
      message += ":this";
      chatcontent2[0] = chatcontent2[0].replace(/^\s*[\r\n]/gm, ''); //quito lineas en blanco q sobran
      message += '\n\n' + chatcontent2[0];
      message += "flow:message ";
      var names = chatcontent2[1].split(",");
      for (let i = 0; i < names.length; i++) {
        if (names[i].includes(":Msg")) {
          if (names[i].includes(".")) {
            let n = names[i].split(".");
            names[i] = n[0];
          }
          names[i] = names[i].replace(/\s/g, '');
          if (!names[i].includes(nameMessage)) {
            message += names[i];
            if (i < names.length - 1) {
              message += ", ";
            }
            else {
              message += ".";
            }
          }
        }
      }
      /*console.log(body);*/
      console.log(message);
      this.fileClient.updateFile(urlfile, message).then(success => {
        console.log('message has been removed');
      }, (err: any) => console.log(err));
    }, err => null).catch(error => console.log("Not able to read file"));
  }

  isChatCreated = async (userID: string, friendID: string) => {
    //si existe el ttl:
    let chatuserUrl = "https://" + this.getUsername(userID) + ".solid.community/private/Chat" + friendID + "/"
    try {
      return await this.fileClient.readFile(chatuserUrl + "index.ttl#this").then(function (result) {
        return true;
      }, function (error) {
        return false;
      }).catch(error => console.log("Not able to read file"));
    } catch (err) { }

  }
  createBaseChat(url: String) {
    //si existe el ttl:
    this.fileClient.readFile(url + "index.ttl#this").then(body => {
      console.log('-----------------------------------------------------');
      console.log('Chat exists, no action needed');
      console.log('-----------------------------------------------------');
    }, err =>
        this.fileClient.createFolder(url).then(success => {
          console.log('Folder Created');
          this.fileClient.createFile(url + "index.ttl#this").then(fileCreated => {
            this.fileClient.updateFile(fileCreated, this.basechat).then(success => {
              this.givePermissions(url+'.acl');
              console.log('chat has been started');
            }, (err: any) => console.log(err)).catch(error => console.log("File not updated"));
          }, err => console.log(err)).catch(error => console.log("File not created"));
        }, err => console.log(err))).catch(error => console.log("Not able to create folder"));
  }

  async loadMessages(user, friend) {
    let username = friend.replace('https://', '');
    let name = username.split('.')[0];
    if (name != "undefined") {
      await this.getMessagesFromPOD(user);
      await this.getMessagesFromPOD(friend);
    }
    return this.chat;
  }

  resetChat() {
    this.chat = new SolidChat(this.userID, this.friendID);
  }

  /* Método que recibe la url de la POD de la que se quiere recuperar los mensajes
  */
  getMessagesFromPOD(url) {
    try {
      var chatcontent: any;

      //console.log("loadMessages url: " + url);

      try {
        this.fileClient.readFile(url).then(body => {
          chatcontent = body;

          var split = chatcontent.split(':Msg');

          split.forEach(async str => {
            var content = str.substring(str.indexOf("n:content"), str.indexOf("\";"));
            var maker = this.getUsername(url);
            var time_not_parsed = str.substring(str.indexOf("terms:created "), str.indexOf("^^XML:dateTime;"));
            var time_array = time_not_parsed.split("T").join(".").split(".");
            var time = time_array[0] + " " + time_array[1];
            this.addToChat(content, maker, time);
          })
        }).catch(error => console.log("File not founded"));
      }
      catch (err) { 
      }
    }
    catch (error) {
      console.log("Not getting messages from POD");
    }
  }
  /*
    Método que añade el contenido del mensaje al objeto SolidChat. En caso de que este vacío
    o su contenido sea "Chat Started" este no lo añade. 
  */
  private addToChat(msg: string, maker: string, time = "") {
    let content = msg.substring(msg.indexOf("\"") + 1);
    let messageTime = time.substring(time.indexOf("\"") + 1);
    if (content != "" && content.length > 0 && content != "Chat Started") {
      this.chat.messages.push(new SolidMessage(maker, content, messageTime));
    }
  }

  removeChat(user:string,nameFriend:string){
    let url = "https://" + user + ".solid.community/private/Chat" + nameFriend + "/index.ttl#this"
    this.fileClient.deleteFile(url).then(success => {
      console.log(`Deleted ${url}.`);
    }, err => console.log(err)).catch(error => console.log("File not deleted"));
    /*this.fileClient.deleteFolder("https://" + user + ".solid.community/private/Chat" + nameFriend).then(success => {
      console.log(`Deleted ${url}.`);
    }, err => console.log(err)).catch(error => console.log("Folder not deleted"));*/
  }
  /* 
    Método que sube la imagen a la POD y envia un mensaje con la URL para que sea posible
    mostrarla. En caso de que ya exista la imagen únicamente envia la URL, no trata de subirla de nuevo.
  */
  uploadImage(image: File) {
    let url = "https://" + this.getUsername(this.userID) + ".solid.community/private/Chat" + this.getUsername(this.friendID) + "/" + image.name;
    
    if(this.fileClient.readFile(url) != null){
      this.fileClient.createFile(url, image);
    }
    
    this.postMessage(new SolidMessage(this.userID, url));
  }

  //Sube y acualiza la imagen de background del chat
  async uploadBackground(image: File){
    let url = "https://" + this.getUsername(this.userID) + ".solid.community/private/Chat" + this.getUsername(this.friendID) + "/" + image.name;
    try{
      this.fileClient.updateFile(url,image).then(success => {
        console.log(`Deleted ${url}.`);
      }, err => console.log(err)).catch(error => console.log("File not updated"));
    }
    catch(error){}

  }

  /*
    Método que recibe la url del amigo al que quieres dar permisos a la carpeta de chat.
    Se crea una base para el .acl, @prefix c: es el propio usuario, y para dar permiso a
    más usuarios se pone un @prefix cn: + el ID, por cada uno, que en este caso será una
    sola persona.
  */
  givePermissions(url:string){
    var id = this.friendID.substring(0,this.friendID.length-2);
    this.baseAcl = `@prefix : <#>.
    @prefix n0: <http://www.w3.org/ns/auth/acl#>.
    @prefix Ch: <./>.
    @prefix c: </profile/card#>.
    @prefix c0: <${id}>.
    
    :ControlReadWrite
        a n0:Authorization;
        n0:accessTo Ch:;
        n0:agent c:me;
        n0:defaultForNew Ch:;
        n0:mode n0:Control, n0:Read, n0:Write.
    :Read
        a n0:Authorization;
        n0:accessTo Ch:;
        n0:agent c0:me;
        n0:defaultForNew Ch:;
        n0:mode n0:Read.`;
    console.log(url);
    this.fileClient.createFile(url,this.baseAcl).then(success => {
      console.log('permissions given');
    }, (err: any) => console.log(err));
  }

  /*Recibe como parametros la lista de usuarios que formarán parte del grupo y un nombre, se crea una carpeta con el nombre del grupo 
  y posteriormente un archivo index.ttl  que contiene los mensajes*/
  createGroupChat(users:Array<string>,groupName:string){
    let i = 0;
    let j = 0;
    let d = new Date();
    let url = "https://" + this.getUsername(this.userID) + ".solid.community/private/GroupChat" + groupName + "/";

    this.basechat = 
    `@prefix : <#>.
    @prefix ic: <http://www.w3.org/2002/12/cal/ical#>.
    @prefix XML: <http://www.w3.org/2001/XMLSchema#>.
    @prefix flow: <http://www.w3.org/2005/01/wf/flow#>.
    @prefix c: </profile/card#>.`;
    
    users.forEach(user => {
      this.basechat+=
      `@prefix c${i}: <${user.substring(0,this.friendID.length-2)}>.`;
      i++;
    });

   this.basechat+= 
   `@prefix ui: <http://www.w3.org/ns/ui#>.
    @prefix mee: <http://www.w3.org/ns/pim/meeting#>.
    @prefix n0: <http://purl.org/dc/elements/1.1/>.
    
    :id${this.randomInt()}
        ic:dtstart "2019-04-28T14:15:26Z"^^XML:dateTime;
        flow:participant c:me;
        ui:backgroundColor "#c1f1f7".`;

    users.forEach(user => {
      this.basechat+=
      `:id${this.randomInt()}
          ic:dtstart "${d.toISOString()}"^^XML:dateTime;
          flow:participant c${j}:me;
          ui:backgroundColor "#c1f1f7".`;
      j++;
    });

    this.basechat+=
    `:this
        a mee:LongChat;
        n0:author c:me;
        n0:created "2019-04-28T14:15:23Z"^^XML:dateTime;
        n0:title "Chat channel";
        flow:participation :id1556460926376;
        ui:sharedPreferences :SharedPreferences.`;

    this.fileClient.createFolder(url).then(success => {
      console.log('Folder Created');
        this.fileClient.createFile(url + "index.ttl#this").then(fileCreated => {
          this.fileClient.updateFile(fileCreated, this.basechat).then(success => {
            console.log('chat has been started');
          }, (err: any) => console.log(err)).catch(error => console.log("File not updated"));
        }, err => console.log(err)).catch(error => console.log("File not created"));
    });
  }

  randomInt(){
    return Math.floor(Math.random()*(Number.MAX_VALUE-Number.MIN_VALUE))+Number.MIN_VALUE;
  }

}
