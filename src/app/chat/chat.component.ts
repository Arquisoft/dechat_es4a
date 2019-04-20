import { Component, ElementRef, OnInit, Renderer2, SecurityContext, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { RdfService } from '../services/rdf.service';
import { AuthService } from '../services/solid.auth.service';
import { SolidMessage } from '../models/solid-message.model';
import { SolidProfile } from '../models/solid-profile.model';
import { ToastrService } from 'ngx-toastr';
import { SolidChatUser } from '../models/solid-chat-user.model';
import { Howl, Howler } from 'howler';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SolidChat } from '../models/solid-chat.model';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { escapeRegExp } from 'tslint/lib/utils';

class ImageSnippet {
  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  amigos = [];
  namesFriends = [];
  mapFriendsTotal = new Map<String, String>();
  mapContacts = new Map<String, String>();
  profileImage: string;
  profile: SolidProfile;
  friendActive: string;
  friendPhotoActive: string;
  chatUsers = []; //contiene lista de solid chat users 

  //Para los emojis:
  text: string = '';
  openPopup: Function;

  //Subida de imagenes
  selectedFile: ImageSnippet;
  URL: string;
  _changeDetection;

  /** message: string = '';*/
  fileClient: any;
  messages: Array<SolidMessage> = new Array();

  //Para parar el intervalo de carga de mensajes
  refreshIntervalId: any;

  //Array de mensajes borrados -> para que no aparezca en pantalla de nuevo
  msgRemoved: Array<SolidMessage> = new Array();

  //Fecha del ultimo mensaje
  dateLastMessage:string;
  secondMessage = 0;

  @ViewChild('chatbox') chatbox: ElementRef;

  constructor(private rdf: RdfService, private chat: ChatService, private renderer: Renderer2, private auth: AuthService,
    private router: Router, private toastr: ToastrService, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadFriends();
    this.refreshMessages();
  }

  //Carga los amigos
  loadFriends() {
    if (!this.auth.getOldFriends()) {
      const list_friends = this.rdf.getFriends();
      this.auth.saveFriends(this.rdf.getFriends());
      if (list_friends) {
        this.amigos = list_friends;
      }
    }
    else {
      const list_friends = this.auth.getOldFriends();
      if (list_friends) {
        this.amigos = list_friends;
      }
    }
    this.getNamesFriends();
    this.getPhotoFriends();
  }

  //Guarda la url de la imagen de perfil de cada amigo
  async getPhotoFriends() {
    try {
      let i = 0;
      let profileImage;
      for (i = 0; i < this.amigos.length; i++) {
        const profile = await this.rdf.getPhotoFriend(this.amigos[i]);
        if (profile) {
          profileImage = profile.image ? profile.image : '/assets/images/profile.png';
        }
        else {
          profileImage = '/assets/images/profile.png';
        }
        let transformIm = profileImage.toString();
        if (transformIm.match('>')) {
          transformIm = transformIm.replace('>', '');
        }
        if (transformIm.match('<')) {
          transformIm = transformIm.replace('<', '');
        }
        let username = profile.url.replace('https://', '');
        let user = username.split('.')[0];
        this.mapFriendsTotal.set(user, transformIm);

        const bool = await this.chat.isChatCreated(this.auth.getOldWebId(), user);
        if (bool) {
          this.mapContacts.set(user, transformIm);
        }
        let chatuser = new SolidChatUser(profile.url, user, transformIm);
        this.chatUsers.push(chatuser);
      }
    } catch (error) {
      console.log(`Error: ${error}`);

    }
  }

  //Añade a un array los nombres de lo contactos
  getNamesFriends() {
    let i = 0;
    for (i = 0; i < this.amigos.length; i++) {
      let username = this.amigos[i].replace('https://', '');
      let user = username.split('.')[0];
      this.namesFriends.push(user);
    }
  }

  //Crea el inbox del chat
  createInboxChat(submitterWebId: string, destinataryWebId: string): any {
    this.chat.createInboxChat(submitterWebId, destinataryWebId);
  }

  //Envía mensajes y los guarda
  send(content: string, event) {
    var value = (<HTMLInputElement>document.querySelector('.emojiInput')).value;
    if (this.friendActive) {
      if (!(content == "") && value) {
        let user = this.getUsername();
        let message = new SolidMessage(user, content, (new Date()).toISOString());
        this.chat.postMessage(message);
        //Para añadirlo al array de mensajes, edito el tiempo para que pueda ser mostrado correctamente
        let time = (new Date()).toISOString();
        time = time.replace('T', ' ');
        time = time.replace('Z', '');
        let noMiliseconds =  time.slice(0, time.length-4);
        let messageTimeChanged = new SolidMessage(user, content, noMiliseconds);
        this.messages.push(messageTimeChanged);
      }
    }
    this.cleanInput();
  }

  //Limpia el input de texto
  cleanInput() {
    var value = (<HTMLInputElement>document.querySelector('.emojiInput')).value;
    (<HTMLInputElement>document.querySelector('.emojiInput')).value = null;
    this.text = "";
  }

    //Carga mensajes en el array de mensajes para mostrarlos en pantalla
  private async loadMessages() {

    try {

      var chat = await this.chat.loadMessages(this.getChatUrl(this.getUsernameFromId(this.rdf.session.webId), this.friendActive), this.getChatUrl(this.friendActive, this.getUsernameFromId(this.rdf.session.webId)));

      await chat.messages.sort(function (a, b) {
        if (a.time > b.time)
          return 1;
        if (b.time > a.time)
          return -1
        else
          return 0;
      });

      await chat.messages.forEach(message => {
        if (message.content && message.content.length > 0) {
          if (!this.checkExistingMessage(message)) {
            this.messages.push(message);
            let realDate = new Date(message.time);
            realDate.setHours(new Date(message.time).getHours() + 2);
            if (new Date().getTime() - realDate.getTime() < 30000) {
              this.toastr.info("You have a new message from " + message.authorId);
              let sound = new Howl({
                src: ['../dechat_es4a/assets/sounds/alert.mp3'], html5: true
              });
              Howler.volume(1);
              sound.play();
            }
          }
        }
      });
    }
    catch (error) {
      console.log("No messages founded")
    }

  }

  //Busca por nuevos mensajes
  refreshMessages() {
    try {
      this.refreshIntervalId = setInterval(() => {
        try {
          this.loadMessages().catch((error) => {
            throw new Error('Higher-level error. ' + error.message);
          });
        }
        catch (error) { }
      }, 1000);
    } catch (error) { }
  }

  //Chequea si ya existe mensajes en el array (para que no los imprima en bucle por pantalla)
  checkExistingMessage(m: SolidMessage) {
    let i;
    let a = 0;
    this.msgRemoved.forEach(msg => {
      if (m.content.includes(msg.content)) {
        a += 1;
      }
    });
    if (a > 0) {
      return true;
    }
    for (i = 0; i < this.messages.length; i++) {
      if (m.content === this.messages[i].content && m.authorId === this.messages[i].authorId) {
        return true;
      }
    }
    return false;
  }

  /*handleSubmit(event) {
    if (event.keyCode === 13) {
      this.send();
    }
  }*/

  //Devuelve el nombre de usuario según el id
  getUsernameFromId(id): string {
    let username = id.replace('https://', '');
    let user = username.split('.')[0];
    return user;
  }

  //Devuelve el nombre de usuario loggeado
  getUsername(): string {
    let id = this.auth.getOldWebId();
    let username = id.replace('https://', '');
    let user = username.split('.')[0];
    return user;
  }

  //Sale de sesión
  logout() {
    this.auth.solidSignOut();
  }

  //Redirecciona al chat
  goToChat() {
    this.router.navigateByUrl('/chat');
  }

  //Asigna una imagen por defecto cuando las cuentas no tienen imagen de perfil
  async loadProfile() {
    try {
      const profile = await this.rdf.getProfile();
      if (profile) {
        this.profile = profile;
        this.profileImage = this.profile.image ? this.profile.image : '/assets/images/profile.png';
      }
      else {
        this.profileImage = '/assets/images/profile.png';
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  //Cambiar chat cada vez que se hace click, tiene que cargar mensajes de otra persona
  changeChat(name: string, photo: string) {
    this.toastr.info('The messages are being loaded, it will take just a second!');
    this.messages = []; //vacia el array cada vez q se cambia de chat para que no aparezcan en pantalla
    this.friendActive = name;
    this.friendPhotoActive = photo;
    this.dateLastMessage = undefined;
    this.chat.createInboxChat(this.auth.getOldWebId(), "https://" + name + ".solid.community/profile/card#me");
    this.loadMessages();
  }

  //Devuelve el amigo del chat que se esta mostrando en pantalla
  getFriendActive() {
    return this.friendActive;
  }

  //Devuelve la foto del amigo del chat que se esta mostrando en pantalla
  getFriendPhotoActive() {
    return this.friendPhotoActive;
  }

  changeBackground(event) {
    console.log("CAMBIAR BACKGROUND");
  }

  changeColorAppearance() {
    console.log("CAMBIAR COLOR");
  }

  //Imprime el mensaje si no se eligió ningún contacto para chatear
  getStringChat(): String {
    if (!this.friendActive) {
      return "Select contact to start chatting";
    }
    else {
      return;
    }
  }

  //Devuelve el url del chat del amigo en la cuenta loggeada 
  getChatUrl(user: string, friend: string) {
    let chatUrl = "https://" + user + ".solid.community/private/Chat" + friend + "/index.ttl#this";

    return chatUrl;
  }

  //Devuelve true si el mensaje es nuestro (de la cuenta loggeada) o del amigo
  isContactMessage(m: SolidMessage) {
    let contact = this.friendActive;
    let messageAuthor = m.authorId;
    if (messageAuthor.match(contact)) {
      return false;
    }
    else {
      return true;
    }
  }

  //Buscador de amigos en la lista de amigos sin chat creado
  searchNewContact(friend:string){
    let cloneMapFriends = new Map(this.mapFriendsTotal);
    this.mapFriendsTotal.clear();
    if (friend != "") {
      cloneMapFriends.forEach((value: string, key: string) => {
        if (key.includes(friend)) {
          this.mapFriendsTotal.set(key, value);
        }
      });
    }
    else {
      this.loadFriends();
    }
  }

  //Buscador de contactos de la lista de contactos con chat creado
  searchContact(friend:string){
    let cloneMapFriends = new Map(this.mapContacts);
    this.mapContacts.clear();
    if (friend != "") {
      cloneMapFriends.forEach((value: string, key: string) => {
        if (key.includes(friend)) {
          this.mapContacts.set(key, value);
        }
      });
    }
    else {
      this.loadFriends();
    }
  }
  
  //Para saber si el chat ya ha sido creado
  async isChatCreated(user: string){
    const bool = await this.chat.isChatCreated(this.auth.getOldWebId(),user);
    return bool;
  }

  //Añade al array de contactos al amigo seleccionado y crea un chat nuevo
  createChat(name: string, photo: string){
    this.closeNav();
    this.loadFriends();
    this.changeChat(name, photo);
    this.mapContacts.set(name, photo);
  }

  //Abre el panel vertical
  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }

  //Cierra el panel vertical
  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  //Devuelve true si es imagen
   isImage(str: string) : boolean {
    str = str +'';
    if(str.indexOf('http') != -1 || str.indexOf('jpg') != -1 || str.indexOf('png') != -1 || str.indexOf('jpeg' )!= -1  ){
      return true;
    }
    return false;
  }

  getTrustedUrl(str : string) : SafeResourceUrl{
    return this.sanitizer.bypassSecurityTrustResourceUrl(str);
  }

  //Para el popup de los emojis
  setPopupAction(fn: any) {
    this.openPopup = fn;
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.chat.uploadImage(this.selectedFile.file);
    });

    reader.readAsDataURL(file);
  }

  //Elimina el mensaje de la POD
  async removeMessage(event) {
    await this.chat.removeMessage(event.data);
    for (let i = 0; i < this.messages.length; i++) {
      if (this.messages[i].content == event.data.content && this.messages[i].authorId == event.data.authorId
        && this.messages[i].time == event.data.time) {
        this.msgRemoved.push(this.messages[i]);
        this.messages.splice(i--, 1);
      }
    }
  }

  createGroup() {
    console.log("Create group");
  }

  //Para eliminar todo el chat (incluido de la POD)
  removeChat(friend:string){
    confirm("Are you sure you want to delete this chat?");
    console.log("Removing chat....: " + friend);
    this.chat.removeChat(this.getUsername(), friend);
    this.mapContacts.forEach((value:string,key: string) => {
      if(key.includes(friend)){
        this.mapContacts.delete(key);
      }
    });
    this.friendActive = null;
    this.friendPhotoActive = null;
    this.messages = [];
    this.dateLastMessage = undefined;
    this.secondMessage = 0;
    this.chat.resetChat();
  }

  //Para determinar cuando mostrar la fecha en pantalla
  dateMessages(date:string){
    let year = date.split(" ");
    date = year[0];
    let valueDate = new Date(date);
    let stringDate = valueDate.toString();
    let strings = stringDate.split(" ");
    let fullDate = strings[0] + " " + strings[1] + " " + strings[2] + " " + strings[3];
    this.secondMessage ++;
    if(this.secondMessage == this.messages.length){
      this.secondMessage = 0;
    }
    if(this.messages.length == 1){
      this.dateLastMessage = fullDate;
      return true;
    }
    if(this.secondMessage == 1 || !this.dateLastMessage.includes(fullDate)){
      this.dateLastMessage = fullDate;
      return true;
    }
    return false;
  }

  //Devuelve la hora y minuto del mensaje
  hourMessages(date:string){
    let msgHour = date.split(" ");
    date = msgHour[1];
    let noSeconds =  date.slice(0, date.length-3);
    return noSeconds;
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