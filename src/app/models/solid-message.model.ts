export class SolidMessage {
    constructor(AuthorId, c) {
        this.authorId = AuthorId;
        this.content = c;
        this.time = (new Date()).toString();
    }

    authorId: string;
    friendId: string;
    content: string;
    time: string;
}
