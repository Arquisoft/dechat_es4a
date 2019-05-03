import { OnInit } from "@angular/core";


export class PostService implements OnInit{
    fileClient:any
    
    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }
    
    constructor(fileClient:any){
        this.fileClient = fileClient;
    }
    
}