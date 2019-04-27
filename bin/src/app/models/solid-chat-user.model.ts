export class SolidChatUser {

    constructor(webId, Name, urlPicture) {
        this.name = Name;
        this.webId = webId;
        this.urlPicture = urlPicture;
    }
    name?: string;
    webId?: string;
    messages=[];
    urlPicture:string;
}