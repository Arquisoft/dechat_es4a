import { OnInit } from "@angular/core";
import { SolidMessage } from "../models/solid-message.model";
import { SolidService } from "./solid.service";


export class PostService implements OnInit{
    solidService: SolidService;
    
    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }
    
    constructor(){
        this.solidService = new SolidService();
    }

    sendIndividualMessage(msg: SolidMessage, url:string) :boolean {
      let date = new Date();
      let dm
      date.getMonth() < 10 ? dm = '0'+date.getMonth() : dm  = date.getMonth().toString();
      const msgnb = date.getFullYear().toString() + dm + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds() + 0;
      const message =
      `
        :Msg${msgnb}
            terms:created "${date.toISOString()}"^^XML:dateTime;
            n:content "${msg.content}";
            n0:maker c:me.
            `+ `:this
            `+ `
            `;

      return this.postMessage(url,":this",message,msgnb);
    }

    sendMessageToGroup(msg:SolidMessage, url:string){
      let date = new Date();
      let dm
      date.getMonth() < 10 ? dm = '0'+date.getMonth() : dm  = date.getMonth().toString();
      const msgnb = date.getFullYear().toString() + dm + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds() + 0;
      const message = 
      `
        :Msg${msgnb}
            terms:created "${date.toISOString()}"^^XML:dateTime;
            n:content "${msg.content}";
            n0:maker c:me.
            `+ `:this
            `+ `
              `
      return this.postMessage(url,"ind:this",message,msgnb);
    }

    postMessage(url:string,toSplit:string,content,msgnb):boolean {
      let date = new Date();
    
      let chatcontent = this.solidService.readFile(url)
      if(chatcontent == '' || chatcontent == null) return false;
      
      let chatContent0 = chatcontent.split(toSplit)[0];
      let chatContent1 = chatcontent.split(toSplit)[1].split("flow:message")[0];
      let chatContent2 = chatcontent.split(toSplit)[1].split("flow:message")[1];
  
      let dm
      date.getMonth() < 10 ? dm = '0'+date.getMonth() : dm  = date.getMonth().toString();
  
      const message = chatContent0 + content +chatContent1 + `flow:message ` + `:Msg${msgnb} ,` + chatContent2
      return this.solidService.updateFile(url,message);
    }
}