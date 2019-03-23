import { SolidMessage } from "./solid-message.model";

export class SolidChat {
    constructor(clientId, friendId, webUrl) {
        this.clientId = clientId;
        this.friendId = friendId;
        this.webUrl = webUrl;

        this.messages = new Array();
        this.messages.push(new SolidMessage(clientId, "--chat started--",(new Date()).toISOString()));
    }


    clientId: string;
    friendId: string;
    webUrl: string;
    messages: SolidMessage[];
}
