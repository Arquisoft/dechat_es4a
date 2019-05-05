import { OnInit } from "@angular/core";
import { SolidService } from "./solid.service";

export class PermissionsService implements OnInit{
    
    solidService:SolidService;

    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }

    constructor(){
        this.solidService = new SolidService();
    }

    givePermissionsToUser(url: string,id:string) {
        let baseAcl = `@prefix : <#>.
        @prefix n0: <http://www.w3.org/ns/auth/acl#>.
        @prefix Ch: <./>.
        @prefix c: </profile/card#>.
        @prefix c0: <${id}>.
        
        :ControlReadWrite
            a n0:Authorization;
            n0:accessTo Ch:;
            n0:agent c:me;
            n0:defaultForNew Ch:;
            n0:mode n0:Control, n0:Read, n0:Write.
        :Read
            a n0:Authorization;
            n0:accessTo Ch:;
            n0:agent c0:me;
            n0:defaultForNew Ch:;
            n0:mode n0:Read.`;
        
        this.solidService.createFile(url) ? this.solidService.updateFile(url,baseAcl) : console.log('couldnt give permisions to '+ url);
      }

    givePermissionsInvitations(url: string) {
        let baseAcl = `@prefix : <#>.
        @prefix n0: <http://www.w3.org/ns/auth/acl#>.
        @prefix ch: <./>.
        @prefix c: </profile/card#>.
        @prefix n1: <http://xmlns.com/foaf/0.1/>.
        
        :ControlReadWrite
            a n0:Authorization;
            n0:accessTo ch:;
            n0:agent c:me;
            n0:defaultForNew ch:;
            n0:mode n0:Control, n0:Read, n0:Write.
        :ReadWrite
            a n0:Authorization;
            n0:accessTo ch:;
            n0:agentClass n1:Agent;
            n0:defaultForNew ch:;
            n0:mode n0:Read, n0:Write.`;
        this.solidService.createFile(url) ? this.solidService.updateFile(url,baseAcl) : console.log('couldnt give permissions to '+url);
      }

    giveGroupPermissions(users: Array<string>,url:string){
        let id = "";
        let i = 0;
    
        let baseAcl = `@prefix : <#>.
        @prefix n0: <http://www.w3.org/ns/auth/acl#>.
        @prefix Ch: <./>.
        @prefix c: </profile/card#>.
        `;
        
        users.forEach(user => {
          id = user.substring(0,user.length-2);
          baseAcl += `@prefix c${i}: <${id}>.
          `;
          i++;
        });
        
        baseAcl += 
       `:ControlReadWrite
            a n0:Authorization;
            n0:accessTo Ch:;
            n0:agent c:me;
            n0:defaultForNew Ch:;
            n0:mode n0:Control, n0:Read, n0:Write.
        :Read
            a n0:Authorization;
            n0:accessTo Ch:;
            n0:agent`; 
        for(let i in users){
          Number(i) < users.length - 1 ? baseAcl += ` c${i}:me, ` :  baseAcl += `c${i}:me;
           `
        }
        baseAcl+=
           `
           n0:defaultForNew Ch:;
           n0:mode n0:Read.`;
       
        this.solidService.createFile(url) ? this.solidService.updateFile(url,baseAcl) : console.log('couldnt give permissions to '+url)
    }

}