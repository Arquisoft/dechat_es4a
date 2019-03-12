import { Injectable, OnInit } from '@angular/core';
import { RdfService } from './rdf.service';
import { SolidProfile } from '../models/solid-profile.model';
import { SolidSession } from '../models/solid-session.model';

import {User} from '../models/user.model';

declare let solid: any;

@Injectable({
    providedIn: 'root',
  })
export class ChatService implements OnInit{


    session : SolidSession;

    user:User;
    friend:User;

    fileClient:any; 

    constructor(private rdf:RdfService){}
    
    ngOnInit() {
       this.fileClient = require('solid-file-client');
    }
    
    getUserProfile(webid):SolidProfile{
        var profile : SolidProfile;
        
        profile.fn = this.rdf.getValueFromVcard('fn',webid);
        
        return profile;
    };

    getSession = async() => {
        this.session = await solid.auth.currentSession(localStorage);
    };

    createInboxChat(friendWebId:string) {
        let str = "/profile/card#me";
        friendWebId = friendWebId.replace(str,"/public/dechat");

        this.fileClient.createFolder(friendWebId).then(success => {
            console.log(`Created folder ${friendWebId}.`);
        }, err => console.log(err) );
    };

    

}