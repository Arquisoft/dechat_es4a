import { SolidService } from "./solid.service";
import { OnInit } from "@angular/core";
import { stringify } from "@angular/compiler/src/util";
import { SolidMessage } from "../models/solid-message.model";


export class ReadService implements OnInit{
    
    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }

    messages:Array<SolidMessage>;
    solidService:SolidService;

    constructor(){
        this.solidService = new SolidService();
        this.messages = new Array();
    }

    getChatMessagesFromPOD(url:string){
        let chatcontent = this.solidService.readFile(url);
        let maker = this.getUsername(url);
        if(chatcontent != null || chatcontent != '') this.parseMessagesTTL(chatcontent,maker);
        
        return this.messages;
    }

    getLongChatMessagesFromPOD(url:string){
        let chatFolder = this.solidService.readFolder(url);
        let maker = this.getUsername(url);
        for(let yearFolder of chatFolder.folders){
            let folder = this.solidService.readFolder(yearFolder.url);
            for(let monthFolder of folder.folders){
                folder = this.solidService.readFolder(monthFolder.url);
                for(let dayFolder of folder.folders){
                    folder = this.solidService.readFolder(dayFolder.url);
                    for(let file of folder.files){
                        let chatcontent = this.solidService.readFile(file.url);
                        this.parseMessagesTTL(chatcontent,maker);
                    }
                }
            }
        }
        return this.messages;
    }

    parseMessagesTTL(ttlContent:any,maker){
        var split = ttlContent.split(':Msg');

        split.forEach(async str => {
            var content = str.substring(str.indexOf("n:content"), str.indexOf("\";"));
            var time_not_parsed = str.substring(str.indexOf("terms:created "), str.indexOf("^^XML:dateTime;"));
            var time_array = time_not_parsed.split("T").join(".").split(".");
            var time = time_array[0] + " " + time_array[1];
            this.addToChat(content, maker, time);
        });
    }

    addToChat(msg:string,maker:string,time:string){
        let content = msg.substring(msg.indexOf("\"") + 1);
        let messageTime = time.substring(time.indexOf("\"") + 1);
        if (content != "" && content.length > 0 && content != "Chat Started")
            this.messages.push(new SolidMessage(maker, content, messageTime));
    }

    getUsername(webId: string): string {
        let username = webId.replace('https://', '');
        let user = username.split('.')[0];
    
        return user;
    }
}