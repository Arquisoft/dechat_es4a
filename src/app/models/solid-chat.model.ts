import { SolidMessage } from "./solid-message.model";

export class SolidChat {
    constructor(name:string, clientId:string,friends:Array<string>) {
        this.clientId = clientId;
        this.chatName = name;
        this.friendsId = friends;

        this.isGroup = friends.length > 1;
        
        this.messages = new Array();

    }

    chatName:string;
    clientId: string;
    friendsId: Array<string>;
    isGroup:boolean;
    messages: SolidMessage[];
}
