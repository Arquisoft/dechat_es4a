import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { RdfService } from './rdf.service';
import { SolidProvider } from '../models/solid-provider.model';


const auth = require('solid-auth-client');

interface SolidSession {
  accessToken: string;
  clientId: string;
  idToken: string;
  sessionKey: string;
  webId: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  session: Observable<SolidSession>;
  fechInit = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/sparql-update',
    },
    body: '',
  };

  constructor(private router: Router, private rdf: RdfService) {
    this.isSessionActive();
  }

  /*
   * This will check if current session is active to avoid security problems
  */
  isSessionActive = async () => {
    this.session = from(auth.currentSession());
  }

  /**
   * Alternative login-popup function. This will open a popup that will allow you to choose an identity provider
   * without leaving the current page
   * This is recommended if you don't want to leave the current workflow.
   */
  solidLoginPopup = async () => {
    try {
      await auth.popupLogin({ popupUri: './login-popup'});
      // Check if session is valid to avoid redirect issues
      await this.isSessionActive();

      // popupLogin success redirect to profile
      this.router.navigate(['/card']);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }

  /*
  * Signs out of Solid in this app, by calling the logout function and clearing the localStorage token
  */
  solidSignOut = async () => {
    try {

      await auth.logout();

    } catch (error) {
      console.log(`Error: ${error}`);
    }
      localStorage.removeItem('oldFriends');
      localStorage.removeItem('solid-auth-client');
      localStorage.removeItem('oldWebId');
      localStorage.clear();
      this.router.navigate(['/']);
  }

  saveOldUserData = (profile: any) => {
    if (!localStorage.getItem('oldProfileData')) {
      localStorage.setItem('oldProfileData', JSON.stringify(profile));
    }
  }

  getOldUserData = () => {
    return JSON.parse(localStorage.getItem('oldProfileData'));
  }

  saveWebId(webId: string) {
    if (!localStorage.getItem('oldWebId')) {
      localStorage.setItem('oldWebId', JSON.stringify(webId));
    }
  }

  getOldWebId = () => {
    //console.log("JSON.parse(localStorage.getItem('oldWebId')): " + JSON.parse(localStorage.getItem('oldWebId')));
    return JSON.parse(localStorage.getItem('oldWebId'));
  }

  saveFriends(fiends : any[]) {
    if (!localStorage.getItem('oldFriends')) {
      localStorage.setItem('oldFriends', JSON.stringify(fiends));
    }
  }

  getOldFriends = ( ) => {
    return JSON.parse(localStorage.getItem('oldFriends'));
  }
  /*
  *  Make a call to the solid auth endpoint. It requires an identity provider url, which here is coming from the dropdown, which
  *  is populated by the getIdentityProviders() function call. It currently requires a callback url and a storage option or else
  *  the call will fail.
  */
  solidLogin = async (idp: string) => {
    await auth.login(idp, {
      callbackUri: `${window.location.href}card`,
      storage: localStorage,
    });
  }

  /**
   * Function to get providers. This is to mimic the future provider registry
   *
   * @return {SolidProvider[]} A list of SolidProviders
   */
  getIdentityProviders(): SolidProvider[] {
    const inruptProvider: SolidProvider = {
      name: 'Inrupt',
      image: '/dechat_es4a/assets/images/Inrupt.png',
      loginUrl: 'https://inrupt.net/auth',
      desc: 'Inrupt Inc. provider'
    };
    const solidCommunityProvider: SolidProvider = {
      name: 'Solid Community',
      image: '/dechat_es4a/assets/images/Solid.png',
      loginUrl: 'https://solid.community',
      desc: 'A provider maintained by the Solid Community'
    };
    const otherProvider: SolidProvider = {
      name: 'Other (Enter WebID)',
      image: '/dechat_es4a/assets/images/Generic.png',
      loginUrl: null,
      desc: 'Generic provider'
    };

    return [
      inruptProvider,
      solidCommunityProvider,
      otherProvider
    ];
  }


}
