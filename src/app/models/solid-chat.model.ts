import { SolidMessage } from "./solid-message.model";

export class SolidChat {
    constructor(clientId, friendId, webUrl) {
        this.clientId = clientId;
        this.friendId = friendId;
        this.webUrl = webUrl;

        this.messages = new Array();
    }


    clientId: string;
    friendId: string;
    webUrl: string;
    messages: SolidMessage[];
}
