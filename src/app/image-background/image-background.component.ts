import { Component,ViewChild,Output,EventEmitter,ElementRef,ViewEncapsulation, InjectionToken, Injectable } from '@angular/core';

@Component({
  selector: 'app-image-background',
  templateUrl: './image-background.component.html',
  styleUrls: ['./image-background.component.css'],
  encapsulation:ViewEncapsulation.Emulated
})

@Injectable()
export class ImageBackgroundComponent {

  @ViewChild('canvasval')canvasval:ElementRef;
  @ViewChild('colboxval')colboxval:any;
  url;
  displayData=false;
  displayCol=false;
  private _canvas;
  private _ctx:CanvasRenderingContext2D;
  private _img;
  private _colbox;
  private _hexval;
  private _rgbaval;
 
  @Output() outputColor=new EventEmitter();

  readUrl(event:any) {
    this.displayData=true;
    this.displayCol=true;
    if (event.target.files && event.target.files[0])  {
     var reader = new FileReader();
      reader.onload = (event:any) => {
        this.url = event.target.result;
        this.getimg(this.url);
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  
  getimg(url:string)
  {
  this._colbox=this.colboxval.nativeElement;
  this._colbox.style.cssText = "--bgcolorval:rgba(0,0,0,0)";
  this._hexval="";
  this._rgbaval="";
  this._canvas = this.canvasval.nativeElement;
    this._ctx = this._canvas.getContext("2d");
    this._img=document.createElement("img"),
    this._img.crossOrigin = 'anonymous';
    this._img.src = this.url;
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._img.onload=(()=>
          this._ctx.drawImage(this._img, 0, 0,this._img.width,this._img.height,0, 0,this._canvas.width, this._canvas.height));
  }

  getPixel(event)
  {
    var boundingRect=this._canvas.getBoundingClientRect();
    var x=event.clientX-boundingRect.left;
    var y=event.clientY-boundingRect.top;
    var px=this._ctx.getImageData(x,y,1,1);
    var data_array=px.data;
    var pixelColor="rgba("+data_array[0]+","+data_array[1]+","+data_array[2]+","+data_array[3]+")";
    this._rgbaval=pixelColor;
    var dColor = data_array[2] + 256 * data_array[1] + 65536 * data_array[0];
    this._hexval=('#'+dColor.toString(16));
  this._colbox.style.cssText = "--bgcolorval:"+pixelColor;
  this.outputColor.emit(this._hexval+" "+this._rgbaval); 
  }

}
