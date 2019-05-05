import { OnInit } from "@angular/core";
import { SolidService } from "./solid.service";


export class CreateService implements OnInit{
    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }
    
    constructor(){
        this.solidService = new SolidService();    
    }

    createBaseChat(){
        let baseChat = 
        `
        @prefix : <#>.
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
                            
            `;
    }

    createBaseLongChat(){
        let baseLongChat;
    }

    createBaseLongChatIndex(){

    }

    createBaseLongChatTTL(){
        
    }

    solidService:SolidService
}