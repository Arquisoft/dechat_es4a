export class SolidMessage {
    constructor(AuthorId, c, date = (new Date()).toISOString()) {
        this.authorId = AuthorId;
        this.content = c;
        this.time = date;
    }
    authorId: string;
    friendId: string;
    content: string;
    time: string;
}
