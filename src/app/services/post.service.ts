import { OnInit } from "@angular/core";
import { SolidMessage } from "../models/solid-message.model";
import { SolidService } from "./solid.service";


export class PostService implements OnInit{
    solidService: SolidService;
    msgnb:any;

    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }
    
    constructor(){
        this.solidService = new SolidService();
    }

    sendIndividualMessage(msg: SolidMessage, url:string) :boolean {
      let toSplit = ":this";
      let date = new Date();
      let message = this.createMessage(msg.content,toSplit);

      return this.postMessage(url,toSplit,message);
    }

    sendMessageToGroup(msg:SolidMessage, url:string){
      let toSplit = "ind:this";
      let date = new Date();
      let message = this.createMessage(msg.content,toSplit);

      return this.postMessage(url,toSplit,message);
    }

    createMessage(content: string,toSplit:string){
      let date = new Date();
      let dm;
      date.getMonth() < 10 ? dm = '0'+date.getMonth() : dm  = date.getMonth().toString();
      this.msgnb = date.getFullYear().toString() + dm + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds() + 0;
      
      const message = 
      `
        :Msg${this.msgnb}
            terms:created "${date.toISOString()}"^^XML:dateTime;
            n:content "${content}";
            n0:maker c:me.
            `+ `${toSplit}
            `+ `
              `;

      return message;
    }

    postMessage(url:string,toSplit:string,content):boolean {
      let date = new Date();
    
      let chatcontent = this.solidService.readFile(url)
      if(chatcontent == '' || chatcontent == null) return false;
      
      let chatContent0 = chatcontent.split(toSplit)[0];
      let chatContent1 = chatcontent.split(toSplit)[1].split("flow:message")[0];
      let chatContent2 = chatcontent.split(toSplit)[1].split("flow:message")[1];
  
      const message = chatContent0 + content +chatContent1 + `flow:message ` + `:Msg${this.msgnb} ,` + chatContent2
      return this.solidService.updateFile(url,message);
    }
}