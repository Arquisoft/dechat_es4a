import { Injectable } from '@angular/core';
import { RdfService } from './rdf.service';
import { SolidProfile } from '../models/solid-profile.model';
import { SolidSession } from '../models/solid-session.model';
declare let solid: any;


@Injectable({
    providedIn: 'root',
  })
export class ChatService{

    rdfService: RdfService;

    session : SolidSession;
    userWebId: string;
    friendWebId: string;

    constructor(friendWebId:string){
        this.rdfService = new RdfService(null);
        this.getSession();

        this.friendWebId = friendWebId;
        this.userWebId = this.session.webId;
    }
    
    getUserProfile(webid) {
        var profile : SolidProfile;
        
        profile.fn = this.rdfService.getValueFromVcard('fn',this.friendWebId);
        
        return profile;
    };

    getSession = async() => {
        this.session = await solid.auth.currentSession(localStorage);
    }

}