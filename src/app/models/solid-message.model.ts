export class SolidMessage {
    constructor(AuthorId, c,date) {
        this.authorId = AuthorId;
        this.content = c;
        this.time = date;
    }

    authorId: string;
    friendId: string;
    content: string;
    time: string;
}
