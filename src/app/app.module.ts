import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginPopupComponent } from './login-popup/login-popup.component';
import { LoginComponent } from './login/login.component';
import { CardComponent } from './card/card.component';
import { ChatComponent } from './chat/chat.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';

import { ColorSketchModule } from 'ngx-color/sketch';
import { ColorTwitterModule } from 'ngx-color/twitter'; // <color-twitter></color-twitter>

// Services
import { AuthService } from './services/solid.auth.service';
import { AuthGuard } from './services/auth.guard.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {EmojiPickerModule} from 'ng-emoji-picker';
import {ShContextMenuModule} from 'ng2-right-click-menu'
import {AgoraConfig, AngularAgoraRtcModule} from "angular-agora-rtc";
import { VideoChatComponent } from './video-chat/video-chat.component';
import {RdfService} from "./services/rdf.service"
import {VgStreamingModule} from "videogular2/streaming";
import { ChatService } from './services/chat.service';


export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'login-popup',
    component: LoginPopupComponent
  },
  {
    path: 'card',
    component: CardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'chat',
    component: ChatComponent
  },
  {
    path: 'navbar',
    component: NavbarComponent
  },
  {
    path: 'videoChat',
    component: VideoChatComponent
  }
];

export const agoraConfig: AgoraConfig = { AppID: '9474fbbc318f4821853cdaaa2c7924eb' };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginPopupComponent,
    CardComponent,
    RegisterComponent,
    ChatComponent,
    NavbarComponent,
    VideoChatComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    NgSelectModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule, //required for toastr
    EmojiPickerModule,
    ShContextMenuModule, //For right click menu
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    ColorSketchModule,
    ColorTwitterModule,
    AngularAgoraRtcModule.forRoot(agoraConfig),
    BrowserAnimationsModule,
    VgStreamingModule
  ],
  providers: [AuthService, ChatService, RdfService, ToastrService, AuthGuard],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
