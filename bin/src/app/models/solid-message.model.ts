import { Content } from "@angular/compiler/src/render3/r3_ast";

export class SolidMessage {
    constructor(AuthorId, c, date = (new Date()).toISOString()) {
        this.authorId = AuthorId;
        this.content = c;
        this.time = date;
    }

    public toString = ():string => {
        return this.authorId + ": " + this.content;
    }
    
    authorId: string;
    friendId: string;
    content: string;
    time: string;
}
