import { Injectable } from '@angular/core';
import { RdfService } from './rdf.service';
import { SolidProfile } from '../models/solid-profile.model';
import { SolidSession } from '../models/solid-session.model';

import {User} from '../models/user.model';

declare let solid: any;


@Injectable({
    providedIn: 'root',
  })
export class ChatService{

    rdfService: RdfService;

    session : SolidSession;

    user:User;
    friend:User;

    friendWebId:string;

    constructor(friendWebId:string){
        this.rdfService = new RdfService(null);
        this.getSession();

        this.user.profile = this.getUserProfile(this.session.webId);
        this.friend.profile = this.getUserProfile(friendWebId);

        this.friendWebId= friendWebId;
    }
    
    getUserProfile(webid):SolidProfile{
        var profile : SolidProfile;
        
        profile.fn = this.rdfService.getValueFromVcard('fn',webid);
        
        return profile;
    };

    getSession = async() => {
        this.session = await solid.auth.currentSession(localStorage);
    }

    createInboxChat() {
        this.rdfService.createChat(this.friendWebId);
    };

}