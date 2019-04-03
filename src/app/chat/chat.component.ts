import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Router } from "@angular/router";
/** import { AuthService } from '../services/solid.auth.service';*/
import { ChatService } from '../services/chat.service';
import { RdfService } from '../services/rdf.service';
import { AuthService } from '../services/solid.auth.service';
import { SolidChat } from '../models/solid-chat.model';
import { SolidMessage } from '../models/solid-message.model';
import { SolidProfile } from '../models/solid-profile.model';
import { ToastrService } from 'ngx-toastr';
import { SolidChatUser } from '../models/solid-chat-user.model';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  amigos = [];
  namesFriends = [];
  mapFriends = new Map<String, String>();
  profileImage: string;
  profile: SolidProfile;
  friendActive: string;
  friendPhotoActive: string;
  chatUsers = []; //contiene lista de chat users

  constructor(private rdf: RdfService, private chat: ChatService, private renderer: Renderer2, private auth: AuthService,
    private router: Router, private toastr: ToastrService, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadFriends();
    this.refreshMessages();
  }

  loadFriends() {
    if (!this.auth.getOldFriends()) {
      const list_friends = this.rdf.getFriends();
      this.auth.saveFriends(this.rdf.getFriends());
      if (list_friends) {
        console.log("friends list: " + list_friends);
        let i = 0;
        this.amigos = list_friends;
      }
    }
    else {
      const list_friends = this.auth.getOldFriends();
      if (list_friends) {
        console.log("friends list: " + list_friends);
        let i = 0;
        this.amigos = list_friends;
      }
    }
    this.getNamesFriends();
    this.getPhotoFriends();
  }

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
        this.mapFriends.set(user, transformIm);
        let chatuser = new SolidChatUser(profile.url, user, transformIm);
        this.chatUsers.push(chatuser);
      }
    } catch (error) {
      console.log(`Error: ${error}`);

    }
  }

  getNamesFriends() {
    let i = 0;
    for (i = 0; i < this.amigos.length; i++) {
      let username = this.amigos[i].replace('https://', '');
      let user = username.split('.')[0];
      this.namesFriends.push(user);
    }
  }

  /** message: string = '';*/
  fileClient: any;
  messages: Array<SolidMessage> = new Array();

  @ViewChild('chatbox') chatbox: ElementRef;

  createInboxChat(submitterWebId: string, destinataryWebId: string): any {
    this.chat.createInboxChat(submitterWebId, destinataryWebId);
  }

  send() {
    if (this.friendActive) {
      var content = (<HTMLInputElement>document.getElementById("message")).value;
      if (!(content == "")) {
        let user = this.getUsername();
        let message = new SolidMessage(user, content)
        this.chat.postMessage(message);
        (<HTMLInputElement>document.getElementById("message")).value = "";
        this.messages.push(message);
      }
    }
  }

  private async loadMessages() {
    var chat = await this.chat.loadMessages(this.getUsername());
    chat.messages.forEach(message => {
      if (message.content && message.content.length > 0) {
        if (!this.checkExistingMessage(message)) {
          this.messages.push(message);
          console.log("Esto es mensaje: " + message.content);
          this.toastr.info("You have a new message from " + message.authorId);
        }
      }
    });
  }

  refreshMessages() {
    try {
      setInterval(() => {
        this.loadMessages();
      }, 1000);
    } catch (error) { }

  }

  checkExistingMessage(m: SolidMessage) {
    let i;
    for (i = 0; i < this.messages.length; i++) {
      if (m.content.match(this.messages[i].content) 
      && m.authorId.match(this.messages[i].authorId)) {
        return true;
      }
    }
    return false;
  }

  handleSubmit(event) {
    if (event.keyCode === 13) {
      this.send();
    }
  }

  getUsername(): string {
    let id = this.auth.getOldWebId();
    let username = id.replace('https://', '');
    let user = username.split('.')[0];
    return user;
  }

  logout() {
    this.auth.solidSignOut();
  }

  goToChat() {
    this.router.navigateByUrl('/chat');
  }

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


  changeChat(name: string, photo: string) {
    //Cambiar chat cada vez que se hace click, tiene que cargar mensajes de otra persona
    this.messages = []; //vacia el array cada vez q se cambia de chat para que no aparezcan en pantalla
    this.friendActive = name;
    this.friendPhotoActive = photo;
    this.chat.createInboxChat(this.auth.getOldWebId(), "https://" + name + ".solid.community/profile/card#me");
    this.loadMessages();
  }

  getFriendActive() {
    //devuelve el amigo del chat que se esta mostrando en pantalla
    return this.friendActive;
  }
  getFriendPhotoActive() {
    //devuelve la foto del amigo del chat que se esta mostrando en pantalla
    return this.friendPhotoActive;
  }

  URL:string;
  _changeDetection;

  changeBackground(event) {
    console.log("CAMBIAR BACKGROUND");
    /*const fd = new FormData();
    const img = event.target.files[0];
    console.log("imagen: " + img);
    fd.append('image', event.target.files[0]);
    this.http.post('/assets/images/background/',fd,  {
            headers:{'Content-Type': 'application/json',
                      'Accept': 'application/json',
                      'Access-Control-Allow-Origin': 'http://localhost:4200/'}
          }).subscribe(response => console.log("Upload ok"));*/

    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // Read file as data url
      reader.onloadend = (e) => { // function call once readAsDataUrl is completed
        this.URL = e.target['result']; // Set image in element
        this._changeDetection.markForCheck(); // Is called because ChangeDetection is set to onPush
      };
  }
}

  changeColorAppearance() {
    console.log("CAMBIAR COLOR");
  }

  getStringChat(): String {
    //Imprime el mensaje si no se eligió ningún contacto para chatear
    if (!this.friendActive) {
      return "Select contact to start chatting";
    }
    else {
      return;
    }
  }

  isContactMessage(m:SolidMessage){
    let contact = this.friendActive;
    let messageAuthor = m.authorId;
    if(messageAuthor.match(contact)){
        return false;
      }
    else{
        return true;
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
