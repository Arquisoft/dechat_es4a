export class SolidChatUser {

    constructor(webId, Name) {
        this.name = Name;
        this.webId = webId;
    }
    name?: string;
    webId?: string;
}