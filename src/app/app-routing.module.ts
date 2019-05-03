import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard.service';

import { CardComponent } from './card/card.component';
import { ChatComponent } from './chat/chat.component';
import {RegisterComponent} from "./register/register.component";
import {VideoChatComponent} from "./video-chat/video-chat.component";

export const routes: Routes = [
  {
    path: 'card',
    component: CardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'chat',
    component: ChatComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },{
    path: 'chatVideo',
    component: VideoChatComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
