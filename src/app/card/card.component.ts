import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SolidProfile } from '../models/solid-profile.model';
import { RdfService } from '../services/rdf.service';
import { AuthService } from '../services/solid.auth.service';
import { SolidChat } from '../models/solid-chat.model';
import { FileClient } from 'solid-file-client';
import {trigger, state, style, animate, transition} from '@angular/animations';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  animations: [
    // Each unique animation requires its own trigger. The first argument of the trigger function is the name
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate(-360deg)' })),
      transition('rotated => default', animate('1000ms ease-out')),
      transition('default => rotated', animate('400ms ease-in'))
  ])
]
})
export class CardComponent implements OnInit {

  profile: SolidProfile;
  profileImage: string;
  loadingProfile: Boolean;
  chat: SolidChat;
  FileC: FileClient;
  state: string = 'default';

  @ViewChild('f') cardForm: NgForm;

  constructor(private rdf: RdfService,
    private router: Router, private auth: AuthService) { }

  ngOnInit() {
    this.loadingProfile = true;
    this.loadProfile();
  }
  
  // Loads the profile from the rdf service and handles the response
  async loadProfile() {
    try {
      this.loadingProfile = true;
      const profile = await this.rdf.getProfile();
      if (profile) {
        this.profile = profile;
        this.auth.saveOldUserData(profile);
        this.auth.saveWebId(this.rdf.session.webId);
      }

      this.loadingProfile = false;
      this.setupProfileData();
    } catch (error) {
      console.log(`Error: ${error}`);
    }

  }
  // Format data coming back from server. Intended purpose is to replace profile image with default if it's missing
  // and potentially format the address if we need to reformat it for this UI
  private setupProfileData() {
    if (this.profile) {
      this.profileImage = this.profile.image ? this.profile.image : '/dechat_es4a/assets/images/profile.png';
    } else {
      this.profileImage = '/dechat_es4a/assets/images/profile.png';
    }
  }

  // Example of logout functionality. Normally wouldn't be triggered by clicking the profile picture.
  logout() {
    this.auth.solidSignOut();
  }

  goToChat() {
    this.router.navigateByUrl('/chat');
  }

  rotate() {
    this.state = (this.state === 'default' ? 'rotated' : 'default');
}
}
