export class SolidService{
   
   fileClient: any;
   
   constructor(){
       this.fileClient = require('solid-file-client');
   }
   
   readFile(url:string) : string{
       let fileContent:string;
       
       this.fileClient.readFile(url).then(body => {
        fileContent = body; 
       }, err => {
        console.log(err);
        console.log('Unable to read file at '+url);
       });

       return fileContent;
   }

   createFile(url:string):boolean {
       let success = false;

       this.fileClient.createFile(url).then(success => {
           success = true;
       },err => {
           console.log(err);
           console.log('Unable to create file at '+url);
       });

       return success;
   }

   readFolder(url:string){
       let folderToRead : any;

       this.fileClient.readFolder(url).then(folder => {
           folderToRead = folder;
       },err => {
        console.log('Unable to read folder at '+url);
        console.log(err);
       });

       return folderToRead;
   }

   createFolder(url:string){
       let success:boolean;

       this.fileClient.createFolder(url).then(success => {
            success = true;
       },err => {
            success = false;
            console.log(err);
            console.log('Unable to create folder at ' + url);
       });

       return success;
   }

   updateFile(url:string, content:any){
       let success:boolean;
       
       this.fileClient.updateFile(url,content).then(success => {
            success = true;
       },err => {
            success = false;
            console.log(err);
            console.log('Unable to update file at ' + url);
       });

       return success;
   }

}