import { TestBed, inject,async } from '@angular/core/testing';

import { ChatService } from './chat.service';
import {RouterTestingModule} from "@angular/router/testing";
import {ToastrModule} from "ngx-toastr";
import { SolidChat } from '../models/solid-chat.model';
import { SolidMessage } from '../models/solid-message.model';
import { RdfService } from './rdf.service';

describe('ChatService', () => {

  let chatService: ChatService;
  let rdfService: RdfService;

  let user = "https://miau.solid.community/profile/card#me";
  let friend = "https://feyre.solid.community/profile/card#me";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, ToastrModule.forRoot() ] ,
      providers: [ChatService]
    });
    rdfService = TestBed.get(RdfService);
    chatService = TestBed.get(ChatService);

    chatService.userID = user;
    chatService.friendID = friend;
  });

  it('should be created', inject([ChatService], (service: ChatService) => {
    expect(service).toBeTruthy();
  }));

  it('should get name user from webId', inject([ChatService], (service: ChatService) => {
    let name = service.getUsername(user);
    expect(name).toBe('miau');
  }));

  it('should create inbox chat', inject([ChatService], (service: ChatService) => {
    let idUser1 = "https://miau.solid.community/profile/card#me";
    let idUser2 = "https://feyre.solid.community/profile/card#me";
    let chat1 = "https://" + service.getUsername(idUser1) + ".solid.community/private/Chat" + service.getUsername(idUser2) + "/";
    let chat2 = "https://" + service.getUsername(idUser2) + ".solid.community/private/Chat" + service.getUsername(idUser1) + "/";
    service.createInboxChat(idUser1,idUser2);
    expect(service.userID).toBe(idUser1);
    expect(service.friendID).toBe(idUser2);
    expect(service.chatuserUrl).toBe(chat1);
    expect(service.chatfriendUrl).toBe(chat2);
  }));

  it('should post a message', inject([ChatService], (service: ChatService) => {
    let date = (new Date()).toISOString();
    let msg = new SolidMessage("user", "Hi", date);
    service.postMessage(msg);
  }));

  it('should remove a message', inject([ChatService], (service: ChatService) => {
    let date = (new Date()).toISOString();
    let msg = new SolidMessage("user", "Hi", date);
    service.chatuserUrl = "https://miau.solid.community/private/Chatfeyre/";
    service.removeMessage(msg);
  }));

  it('should return a message', inject([ChatService], (service: ChatService) => {
    service.isChatCreated("https://miau.solid.community/profile/card#me","https://feyre.solid.community/profile/card#me");
  }));

  it('should create base chat', inject([ChatService], (service: ChatService) => {
    service.createBaseChat("https://miau.solid.community/private/Chatfeyre/");
  }));

  it('should reset chat',inject([ChatService], (service: ChatService) => {
    service.resetChat();
  }));

  it('should load messages', async(inject([ChatService],(service: ChatService) => {
    service.loadMessages("https://miau.solid.community/profile/card#me","https://feyre.solid.community/profile/card#me");
  })));

  /*it('should get messages from POD', async(inject([ChatService],(service: ChatService) => {
    service.getMessagesFromPOD("https://miau.solid.community/private/Chatfeyre/index.ttl#this");
  })));*/

  /*it('should add message to chat', async(inject([ChatService],(service: ChatService) => {
    let date = (new Date()).toISOString();
    //service.chat.messages = [];
    service.addToChat("Hola","user1",date);
    //expect(service.chat.messages.length).toBe(1);
  })));*/

  it('should delete whole chat', inject([ChatService],(service: ChatService) => {
    service.removeChat("miau","aida");
  }));

  it('should give permissions', inject([ChatService],(service: ChatService) => {
    service.friendID = "https://feyre.solid.community/profile/card#me";
    service.givePermissions("https://miau.solid.community/private/Chatfeyre/");
  }));

});
