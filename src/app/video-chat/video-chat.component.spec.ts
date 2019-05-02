import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoChatComponent } from './video-chat.component';
import {Config} from "codelyzer";
import {AngularAgoraRtcModule, AngularAgoraRtcService} from "angular-agora-rtc";
import {RouterTestingModule} from "@angular/router/testing";
import {Router} from "@angular/router";
import {agoraConfig, routes} from "../app.module";
import {LoginComponent} from "../login/login.component";
import {CardComponent} from "../card/card.component";
import {LoginPopupComponent} from "../login-popup/login-popup.component";
import {RegisterComponent} from "../register/register.component";
import {ChatComponent} from "../chat/chat.component";
import {NavbarComponent} from "../components/navbar/navbar.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {CommonModule} from "@angular/common";
import {VgControlsModule} from "videogular2/controls";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ShContextMenuModule} from "ng2-right-click-menu";
import {ToastrModule} from "ngx-toastr";
import {VgCoreModule} from "videogular2/core";
import {VgOverlayPlayModule} from "videogular2/overlay-play";
import {VgBufferingModule} from "videogular2/buffering";
import {Renderer2} from "@angular/core";
import {EmojiInputComponent, EmojiPickerModule} from "ng-emoji-picker";
import {ColorSketchModule} from "ngx-color/sketch";
import {ColorTwitterModule} from "ngx-color/twitter";

describe('VideoChatComponent', () => {
  let component: VideoChatComponent;
  let fixture: ComponentFixture<VideoChatComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [ AngularAgoraRtcModule.forRoot(agoraConfig),  CommonModule , NgSelectModule, FormsModule,
        ReactiveFormsModule, ShContextMenuModule , ColorSketchModule, ColorTwitterModule,
        RouterTestingModule.withRoutes(routes) , ToastrModule.forRoot() , VgCoreModule, VgControlsModule,
        VgOverlayPlayModule, VgBufferingModule,  ],
      declarations: [ VideoChatComponent , LoginComponent, CardComponent , ChatComponent , LoginPopupComponent,
        RegisterComponent , NavbarComponent , EmojiInputComponent],
      providers: [AngularAgoraRtcService, Renderer2 ],
      schemas: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
