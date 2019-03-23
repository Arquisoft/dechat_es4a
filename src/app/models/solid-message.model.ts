export class SolidMessage {
    constructor(AuthorId, c,time) {
        this.authorId = AuthorId;
        this.content = c;
        this.time = time;
    }

    authorId: string;
    friendId: string;
    content: string;
    time: string;
}
