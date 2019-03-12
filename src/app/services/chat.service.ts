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

    session : SolidSession;

    user:User;
    friend:User;

    constructor(private rdf:RdfService){}
    
    getUserProfile(webid):SolidProfile{
        var profile : SolidProfile;
        
        profile.fn = this.rdf.getValueFromVcard('fn',webid);
        
        return profile;
    };

    getSession = async() => {
        this.session = await solid.auth.currentSession(localStorage);
    }

    createInboxChat(friendWebId:string) {
        this.rdf.createChat(friendWebId);
        this.friend.profile = this.getUserProfile(friendWebId);
    };

}