import { SolidMessage } from "./solid-message.model";

export class SolidChat {
    constructor(name:string, clientId:string,friends:Array<string>) {
        let i = 0;
        this.clientId = clientId;
        this.friendsId = new Array<string>();
        this.chatName = name;
        
        friends.forEach(friend => {
            this.friendsId.push(friend);
            i++;
        });
        
        this.isGroup = i > 1;
        this.messages = new Array();
        /*this.messages.push(new SolidMessage(clientId, "--chat started--",(new Date()).toISOString()));*/
    }

    chatName:string;
    clientId: string;
    friendsId: Array<string>;
    isGroup:boolean;
    messages: SolidMessage[];
}
