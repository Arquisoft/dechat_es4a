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
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { escapeRegExp } from 'tslint/lib/utils';
import { ColorEvent } from 'ngx-color';

class ImageSnippet {

  constructor(public src: string, public file: File) {


  }

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
  videosSafesURL = {};
  audiosSafesURL = {};
  fileClient: any;
  //Para los emojis:
  text: string = '';
  openPopup: Function;

  //Subida de imagenes
  selectedFile: ImageSnippet;
  URL: string;
  _changeDetection;

  /** message: string = '';*/

  messages: Array<SolidMessage> = new Array();

  //Para parar el intervalo de carga de mensajes
  refreshIntervalId: any;

  //Array de mensajes borrados -> para que no aparezca en pantalla de nuevo
  msgRemoved: Array<SolidMessage> = new Array();

  //Fecha del ultimo mensaje
  dateLastMessage: string;
  secondMessage = 0;

  //Invitaciones aceptadas
  acceptedInvitations = [];

  @ViewChild('chatbox') chatbox: ElementRef;

  constructor(private rdf: RdfService, private chat: ChatService, private renderer: Renderer2, private auth: AuthService,
    private router: Router, private toastr: ToastrService, private sanitizer: DomSanitizer) {
    this.fileClient = require('solid-file-client');
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadFriends();
    this.refreshMessages();
    //crear carpeta para notificaciones
    this.createFolderNotifications();
    this.lookForInvitations();
  }



  getWebId(): string {
    const webId = this.rdf.getWebId();
    return webId;
  }
  //Carga los amigos
  async loadFriends() {
    if (!this.auth.getOldFriends()) {
      const friends = await this.rdf.getFriends();
      this.auth.saveFriends(friends.list_friends);
      if (friends.list_friends) {
        this.amigos = friends.list_friends;
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

        const bool = await this.chat.isChatCreated(this.getOldWebId(), user);
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
        let noMiliseconds = time.slice(0, time.length - 4);
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

      var chat = await this.chat.loadMessages(this.getChatUrl(this.getUsernameFromId(this.getWebId()), this.friendActive), this.getChatUrl(this.friendActive, this.getUsernameFromId(this.getWebId())));

      await chat.messages.sort(function (a, b) {
        if (a.time > b.time)
          return 1;
        if (b.time > a.time)
          return -1
        else
          return 0;
      });
      let user = await this.getUsername();
      await chat.messages.forEach(message => {
        if (message.content && message.content.length > 0) {
          if (!this.checkExistingMessage(message)) {
            this.messages.push(message);
            let realDate = new Date(message.time);
            realDate.setHours(new Date(message.time).getHours() + 2);
            if (new Date().getTime() - realDate.getTime() < 30000) {
              if (message.authorId != this.chat.userID) {
                this.toastr.info("You have a new message from " + message.authorId);
                let sound = new Howl({
                  src: ['../dechat_es4a/assets/sounds/alert.mp3'], html5: true
                });
                Howler.volume(1);
                sound.play();
              }
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
  getOldWebId(): string {
    return this.auth.getOldWebId();
  }


  getUsername(): string {
    try {
      let id = this.getOldWebId();
      if (id != null || id != undefined) {
        let username = id.replace('https://', '');
        let user = username.split('.')[0];
        return user;
      }
      return "";
    }
    catch (error) {
      console.log(`Error webId: ${error}`);
    }
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
    this.chat.createInboxChat(this.getOldWebId(), "https://" + name + ".solid.community/profile/card#me");
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

  //Procesar imagen background chat.
  async changeBackground(imageInput: any) {
    console.log("CAMBIANDO BACKGROUND...");
    const file: File = imageInput.files[0];
    let type = file.type.split("/");
    const myNewFile = new File([file], 'background.' + type[1], { type: file.type });
    console.log("myNewFile.name: " + myNewFile.name);
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, myNewFile);
      this.chat.uploadBackground(this.selectedFile.file);
      this.setBackground(reader.result);
    });
    reader.readAsDataURL(file);
  }

  //Coloca la imagen del input como background
  setBackground(imageURL) {
    document.getElementById("content").style.backgroundImage = "url(" + imageURL + ")";
    document.getElementById("content").style.backgroundRepeat = "no-repeat";
    document.getElementById("content").style.backgroundPosition = "center";
    document.getElementById("content").style.backgroundSize = "cover";
  }

  //Devuelve la url del background chat si hay un amigo elegido
  getUrlBackground() {
    let url = "https://" + this.getUsername() + ".solid.community/private/Chat" + this.friendActive + "/background.jpeg";
    if (this.friendActive != undefined) {
      return "url('" + url + "')";
    }
    return "url('/assets/images/cosmos.jpg')";
  }

  openColorPicker() {
    console.log("CAMBIANDO COLOR...");
    event.stopPropagation();
    document.getElementById('colorPicker').style.display = "block";
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
  searchNewContact(friend: string) {
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
  searchContact(friend: string) {
    let cloneMapFriends = new Map(this.mapContacts);
    this.mapContacts.clear();
    if (friend != "") {
      cloneMapFriends.forEach((value: string, key: string) => {
        if (key.toLowerCase().includes(friend.toLowerCase())) {
          this.mapContacts.set(key, value);
        }
      });
    }
    else {
      this.loadFriends();
    }
  }

  //Para saber si el chat ya ha sido creado
  async isChatCreated(user: string) {
    const bool = await this.chat.isChatCreated(this.getOldWebId(), user);
    return bool;
  }

  //Añade al array de contactos al amigo seleccionado y crea un chat nuevo
  createChat(name: string, photo: string) {
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
  isImage(str: string): boolean {
    str = str + '';
    if (str.indexOf('jpg') != -1 || str.indexOf('png') != -1 || str.indexOf('jpeg') != -1) {
      return true;
    }
    return false;
  }

  //Devuelve true si es video (archivo online)
  isVideo(str: string): boolean {
    str = str + '';
    if (str.indexOf('youtu.be') != -1 || str.indexOf('youtube') != -1 || str.indexOf('.mov') != -1
      || str.indexOf('.avi') != -1 || str.indexOf('.mp4') != -1) {
      if (!this.videosSafesURL[str]) {
        this.videosSafesURL[str] = this.getVideoTrustedUrl(str);
      }
      return true;
    }
    return false;
  }

  //Devuelve true si es audio (archivo subido a la pod)
  isAudio(str: string): boolean {
    str = str + '';
    if (str.indexOf('.wav') != -1 || str.indexOf('.mp3') != -1) {
      if (!this.audiosSafesURL[str]) {
        this.audiosSafesURL[str] = this.getTrustedUrl(str);
      }
      return true;
    }
    return false;
  }

  getTrustedUrl(str: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(str);
  }

  getVideoTrustedUrl(str: string): SafeResourceUrl {
    let url = str.split('&')[0];
    url = url.replace('/youtu.be/', '/youtu.be/embed/');
    url = url.replace('watch?v=', 'embed/');
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
  async removeChat(friend: string) {
    if (confirm("Are you sure you want to delete this chat?")) {
      console.log("Removing chat....: " + friend);
      let user = await this.getUsername();
      this.chat.removeChat(user, friend);
      this.mapContacts.forEach((value: string, key: string) => {
        if (key.includes(friend)) {
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
  }

  //Para determinar cuando mostrar la fecha en pantalla
  dateMessages(date: string) {
    let year = date.split(" ");
    date = year[0];
    let valueDate = new Date(date);
    let stringDate = valueDate.toString();
    let strings = stringDate.split(" ");
    let fullDate = strings[0] + " " + strings[1] + " " + strings[2] + " " + strings[3];
    this.secondMessage++;
    if (this.secondMessage == this.messages.length) {
      this.secondMessage = 0;
    }
    if (this.messages.length == 1) {
      this.dateLastMessage = fullDate;
      return true;
    }
    if (this.secondMessage == 1 || !this.dateLastMessage.includes(fullDate)) {
      this.dateLastMessage = fullDate;
      return true;
    }
    return false;
  }

  //Devuelve la hora y minuto del mensaje
  hourMessages(date: string) {
    let msgHour = date.split(" ");
    date = msgHour[1];
    let noSeconds = date.slice(0, date.length - 3);
    let hour: number = parseInt(noSeconds.split(':')[0], 10) + 2;
    let finalHour = '00:00';
    if (hour === 24) {
      finalHour = '00:' + noSeconds.split(':')[1];
    }
    else {
      finalHour = hour + ':' + noSeconds.split(':')[1];
    }
    return finalHour;
  }

  //Para saber si la lista con chats esta vacia para mostrar o no el boton de añadir amigo con mensaje 
  hasContactsChats() {
    if (this.mapContacts.size > 0) {
      return true;
    }
    else
      return false;
  }
  addFriend() {

    var urlFriend = (<HTMLInputElement>document.getElementById('webid-name')).value;
    console.log("---------------------------");
    console.log(urlFriend);
    console.log("---------------------------");
    var clientid = this.getWebId();
    console.log(clientid);
    this.fileClient.readFile(clientid).then(body => {

      if (!(urlFriend.indexOf('.solid.community/profile/card') >= 0) || !(urlFriend.indexOf('https://') >= 0)) {

        this.toastr.info('not a valid webid input');
        throw Error();
      } else {
        console.log(body);
        var friendname = this.getUsernameFromId(urlFriend);
        var internalnamevar = "addedfriend" + friendname;
        if (body.indexOf(internalnamevar) >= 0) {
          this.toastr.info('friend already exists in this card');
          throw Error();
        }

        if (body.indexOf('knows') >= 0) {
          // Found know
          var splitbody1 = body.split("pro:card")[0];
          var splitbody2 = body.split("pro:card")[1];
          splitbody2 = `
          @prefix `+ internalnamevar + `: <https://` + friendname + `.solid.community/profile/card#>.

        pro:card` + splitbody2

          body = splitbody1 + splitbody2;
          splitbody1 = body.split(":knows")[0];
          splitbody2 = body.split(":knows")[1];

          splitbody2 = ":knows " + internalnamevar + ":me ," + splitbody2;
          body = splitbody1 + splitbody2;
          console.log(body);


          this.fileClient.updateFile(clientid, body).then(success => {

            this.toastr.info('new friend has been saved');
          }, (err: any) => console.log(err)).catch(error => console.log("File not updated"));
        } else {
          this.toastr.info('adding friends to friendless cards not yet implemented, sorry!');

        }
      }
    }, (err: any) => console.log(err)).catch(error => this.toastr.info('we were unable to read the WebID given'));

    //  this.loadFriends();
    /*
        ChatComponent.addfriend("https://albertong.solid.community/profile/card#me");
        console.log("friend added! (all lies, it's not implemented yet)");
      */

  }

  //Para cambiar los colores del chat
  changeComplete($event: ColorEvent) {
    this.changeLetterColor("fa-user-plus", "#0b3153");
    this.changeLetterColor("fa-bars", "#0b3153");
    this.changeLetterColor("friendText", "#0b3153");
    this.changeLetterColor("wrap", "#0b3153");
    if ($event.color.hex == "#ff6900") {
      document.getElementById('contacts').style.backgroundColor = "#C55F15";
      document.getElementById('sidepanel').style.backgroundColor = "#FF8632";
      document.getElementById('contact-profile').style.backgroundColor = "#FFA669";
      document.getElementById('message-input').style.backgroundColor = "#FFA669";
      this.changeLetterColor("fa-user-plus", "#fff");
      this.changeLetterColor("fa-bars", "#fff");
      this.changeLetterColor("friendText", "#fff");
      this.changeLetterColor("wrap", "#fff");
    }
    else if ($event.color.hex == "#fcb900") {
      document.getElementById('contacts').style.backgroundColor = "#FCB900";
      document.getElementById('sidepanel').style.backgroundColor = "#FFCB3C";
      document.getElementById('contact-profile').style.backgroundColor = "#FFDD7F";
      document.getElementById('message-input').style.backgroundColor = "#FFDD7F";
    }
    else if ($event.color.hex == "#7bdcb5") {
      document.getElementById('contacts').style.backgroundColor = "#7BDCB5";
      document.getElementById('sidepanel').style.backgroundColor = "#A9DCC7";
      document.getElementById('contact-profile').style.backgroundColor = "#D5F8EA";
      document.getElementById('message-input').style.backgroundColor = "#D5F8EA";
    }
    else if ($event.color.hex == "#00d084") {
      document.getElementById('contacts').style.backgroundColor = "#11AC74";
      document.getElementById('sidepanel').style.backgroundColor = "#39CF99";
      document.getElementById('contact-profile').style.backgroundColor = "#8AD1B7";
      document.getElementById('message-input').style.backgroundColor = "#8AD1B7";
      this.changeLetterColor("fa-user-plus", "#fff");
      this.changeLetterColor("fa-bars", "#fff");
      this.changeLetterColor("friendText", "#fff");
      this.changeLetterColor("wrap", "#fff");
    }
    else if ($event.color.hex == "#8ed1fc") {
      document.getElementById('contacts').style.backgroundColor = "#7CB8DE";
      document.getElementById('sidepanel').style.backgroundColor = "#B0DBF7";
      document.getElementById('contact-profile').style.backgroundColor = "#C6DBE8";
      document.getElementById('message-input').style.backgroundColor = "#C6DBE8";
    }
    else if ($event.color.hex == "#0693e3") {
      document.getElementById('contacts').style.backgroundColor = "#1F8AC7";
      document.getElementById('sidepanel').style.backgroundColor = "#55B6ED";
      document.getElementById('contact-profile').style.backgroundColor = "#A1C7DD";
      document.getElementById('message-input').style.backgroundColor = "#A1C7DD";
      this.changeLetterColor("fa-user-plus", "#fff");
      this.changeLetterColor("fa-bars", "#fff");
      this.changeLetterColor("friendText", "#fff");
      this.changeLetterColor("wrap", "#fff");
    }
    else if ($event.color.hex == "#abb8c3") {
      document.getElementById('contacts').style.backgroundColor = "#ABB8C3";
      document.getElementById('sidepanel').style.backgroundColor = "#CCD9E5";
      document.getElementById('contact-profile').style.backgroundColor = "#E0E3E6";
      document.getElementById('message-input').style.backgroundColor = "#E0E3E6";
    }
    else if ($event.color.hex == "#eb144c") {
      document.getElementById('contacts').style.backgroundColor = "#BC254C";
      document.getElementById('sidepanel').style.backgroundColor = "#EA5A80";
      document.getElementById('contact-profile').style.backgroundColor = "#E6B0BE";
      document.getElementById('message-input').style.backgroundColor = "#E6B0BE";
      this.changeLetterColor("fa-user-plus", "#fff");
      this.changeLetterColor("fa-bars", "#fff");
      this.changeLetterColor("friendText", "#fff");
      this.changeLetterColor("wrap", "#fff");
    }
    else if ($event.color.hex == "#f78da7") {
      document.getElementById('contacts').style.backgroundColor = "#F78DA7";
      document.getElementById('sidepanel').style.backgroundColor = "#EAB3C0";
      document.getElementById('contact-profile').style.backgroundColor = "#EFE2E5";
      document.getElementById('message-input').style.backgroundColor = "#EFE2E5";
    }
    else if ($event.color.hex == "#9900ef") {
      document.getElementById('contacts').style.backgroundColor = "#8C2EC1";
      document.getElementById('sidepanel').style.backgroundColor = "#C36BF4";
      document.getElementById('contact-profile').style.backgroundColor = "#DEC0F0";
      document.getElementById('message-input').style.backgroundColor = "#DEC0F0";
      this.changeLetterColor("fa-user-plus", "#fff");
      this.changeLetterColor("fa-bars", "#fff");
      this.changeLetterColor("friendText", "#fff");
      this.changeLetterColor("wrap", "#fff");
    }
    document.getElementById('colorPicker').style.display = "none";
  }

  //Cambia de color las letras
  private changeLetterColor(className: string, color: string) {
    var list = document.getElementsByClassName(className) as HTMLCollectionOf<HTMLElement>;
    var i;
    for (i = 0; i < list.length; i++) {
      list[i].style.color = color;
    }
  }

  //Crea la carpeta para las notificaciones con sus permisos correspondientes
  async createFolderNotifications() {
    let user = await this.getUsername();
    this.chat.createFolderNotifications(user);
  }

  //Busca por nuevas invitaciones en el .txt para aceptar o rechazar
  lookForInvitations() {
    setInterval(() => {
      let invitationURL = "https://" + this.getUsername() + ".solid.community/public/chatInvitation/invitation.txt";
      this.fileClient.readFile(invitationURL).then(body => {
        let content = body;
        console.log("content: " + content);
        let names = content.split(",");
        for (let i = 0; i < names.length; i++) {
          let count = 0;
          for (let j = 0; j < this.acceptedInvitations.length; j++) {
            if (this.acceptedInvitations[j] == names[i]) {
              count++;
            }
          }
          this.mapContacts.forEach((value: string, key: string) => {
            if (key.includes(names[i])) {
              count++;
            }
          });
          if (count == 0) {
            if (names[i] != "") {
              if (confirm(names[i] + " wants to chat with you!\nDo you want to chat with this person?")) {
                //Miramos si es una amigo o un desconocido
                let count = 0;
                this.mapFriendsTotal.forEach((value: string, key: string) => {
                  if (key.includes(names[i])) {
                    count++;
                  }
                });
                if (count == 0) { //Si es desconocido se añade
                  this.addFriendFromInvitation(names[i]);
                }

                this.loadFriends();
                let photo = this.mapFriendsTotal.get(names[i]);
                this.changeChat(names[i], photo.toString());
                this.mapContacts.set(names[i], photo);
                this.acceptedInvitations.push(names[i]);
              }
              else {
                this.acceptedInvitations.push(names[i]);
              }
            }
            this.chat.removeInvitation(invitationURL, names[i]);
          }
        }
      }, (err: any) => console.log("No invitations founded"));
    }, 5000);
  }

  addFriendFromInvitation(friend: string) {
    var clientid = this.getWebId();
    this.fileClient.readFile(clientid).then(body => {
      var friendname = friend;
      var internalnamevar = "addedfriend" + friendname;
      if (body.indexOf(internalnamevar) >= 0) {
        this.toastr.info('friend already exists in this card');
        throw Error();
      }

      if (body.indexOf('knows') >= 0) {
        // Found know
        var splitbody1 = body.split("pro:card")[0];
        var splitbody2 = body.split("pro:card")[1];
        splitbody2 = `
        @prefix `+ internalnamevar + `: <https://` + friendname + `.solid.community/profile/card#>.

      pro:card` + splitbody2

        body = splitbody1 + splitbody2;
        splitbody1 = body.split(":knows")[0];
        splitbody2 = body.split(":knows")[1];

        splitbody2 = ":knows " + internalnamevar + ":me ," + splitbody2;
        body = splitbody1 + splitbody2;
        console.log(body);


        this.fileClient.updateFile(clientid, body).then(success => {

          this.toastr.info('new friend has been saved');
        }, (err: any) => console.log(err)).catch(error => console.log("File not updated"));
      } else {
        this.toastr.info('adding friends to friendless cards not yet implemented, sorry!');

      }
    }, (err: any) => console.log(err)).catch(error => console.log("Not friend correct"));
  }

}




/** ejemplo card sin amigos:
 * @prefix solid: <http://www.w3.org/ns/solid/terms#>.
@prefix foaf: <http://xmlns.com/foaf/0.1/>.
@prefix pim: <http://www.w3.org/ns/pim/space#>.
@prefix schema: <http://schema.org/>.
@prefix ldp: <http://www.w3.org/ns/ldp#>.

<>
    a foaf:PersonalProfileDocument ;
    foaf:maker <https://testfriends.solid.community/profile/card#me> ;
    foaf:primaryTopic <https://testfriends.solid.community/profile/card#me> .

<https://testfriends.solid.community/profile/card#me>
    a foaf:Person ;
    a schema:Person ;

    foaf:name "testfriends" ;

    solid:account </> ;  # link to the account uri
    pim:storage </> ;    # root storage

    ldp:inbox </inbox/> ;

    pim:preferencesFile </settings/prefs.ttl> ;  # private settings/preferences
    solid:publicTypeIndex </settings/publicTypeIndex.ttl> ;
    solid:privateTypeIndex </settings/privateTypeIndex.ttl> .


    */
/**
 misma pod despues de añadir perro y alberto (en ese orden:)
@prefix : <#>.
@prefix solid: <http://www.w3.org/ns/solid/terms#>.
@prefix pro: <./>.
@prefix n0: <http://xmlns.com/foaf/0.1/>.
@prefix schem: <http://schema.org/>.
@prefix ldp: <http://www.w3.org/ns/ldp#>.
@prefix inbox: </inbox/>.
@prefix sp: <http://www.w3.org/ns/pim/space#>.
@prefix tes: </>.
@prefix c: <https://albertong.solid.community/profile/card#>.
@prefix c0: <https://perro.solid.community/profile/card#>.

pro:card a n0:PersonalProfileDocument; n0:maker :me; n0:primaryTopic :me.

:me
 a schem:Person, n0:Person;
 ldp:inbox inbox:;
 sp:preferencesFile </settings/prefs.ttl>;
 sp:storage tes:;
 solid:account tes:;
 solid:privateTypeIndex </settings/privateTypeIndex.ttl>;
 solid:publicTypeIndex </settings/publicTypeIndex.ttl>;
 n0:knows c:me, c0:me;
 n0:name "testfriends".
*/


















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
