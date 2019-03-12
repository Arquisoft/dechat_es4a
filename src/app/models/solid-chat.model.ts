import { SolidMessage } from "./solid-message.model";

export interface SolidChat {

    clientId: string;
    friendId: string;
    webUrl: string;
    messages: SolidMessage[];
}
