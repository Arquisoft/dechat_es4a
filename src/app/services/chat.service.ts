import { Injectable, OnInit } from '@angular/core';
import { RdfService } from './rdf.service';
import { SolidProfile } from '../models/solid-profile.model';
import { SolidSession } from '../models/solid-session.model';

declare let solid: any;

@Injectable({
    providedIn: 'root',
  })
export class ChatService implements OnInit{

    fileClient:any; 

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
        let str = "/profile/card#me";
        let user=this.getUsername(destinataryWebId);
        let folder = "/public/" + user;
        submitterWebId = submitterWebId.replace(str,folder);
    
        this.fileClient.popupLogin().then( webId => {
          console.log( `Logged in as ${webId}.`)
        }, err => console.log(err) );
    
        this.fileClient.createFolder(submitterWebId).then(success => {
          console.log(`Created folder ${submitterWebId}.`);
        }, err => console.log(err) );
    };

    

}