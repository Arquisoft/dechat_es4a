import { SolidProfile } from "./solid-profile.model";
import {Message} from './message.model';

export interface User{
    profile: SolidProfile;
    inbox: Array<Message>
}