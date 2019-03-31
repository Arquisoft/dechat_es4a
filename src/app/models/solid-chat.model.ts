import { SolidMessage } from "./solid-message.model";

export class SolidChat {
    constructor(clientId, friendId) {
        this.clientId = clientId;
        this.friendId = friendId;
        

        this.messages = new Array();
        this.messages.push(new SolidMessage(clientId, "--chat started--",(new Date()).toISOString()));
    }


    clientId: string;
    friendId: string;
    
    messages: SolidMessage[];
}
