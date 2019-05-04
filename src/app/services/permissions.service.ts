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

    givePermissions(url: string,id:string) {
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

}