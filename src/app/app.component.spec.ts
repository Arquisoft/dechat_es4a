import { TestBed, async, inject } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing'
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './login/login.component';
import { LoginPopupComponent } from './login-popup/login-popup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CardComponent } from './card/card.component';
import { RegisterComponent } from './register/register.component';
import { ChatComponent } from './chat/chat.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/navbar/navbar.component';

describe('AppComponent', () => {

  let service: ChatComponent;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NavbarComponent
      ],
      providers: [ChatComponent],
      imports: [
        RouterTestingModule, ToastrModule.forRoot()
      ]
    }).compileComponents();
    service = TestBed.get(ChatComponent);

    let store = {};
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };
    spyOn(localStorage, 'getItem')
      .and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem')
      .and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem')
      .and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear')
      .and.callFake(mockLocalStorage.clear);
  }));


  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();

  }));

  it('should create the chat', async(() => {
    inject([ChatComponent], (service: ChatComponent) => {
      expect(service).toBeTruthy();
    });
  }));
  /*
ejemplos de supuestos test de localstorage

    describe('setAccessToken', () => {
      it('should store the token in localStorage',
        () => {
          service.setAccessToken('sometoken');
          expect(localStorage.getItem('id_token')).toEqual('sometoken');
        });
    });
 
  describe('getAccessToken', () => {
    it('should return stored token from localStorage',
      () => {
        localStorage.setItem('id_token', 'anothertoken');
        expect(service.getAccessToken()).toEqual('anothertoken');
      });
  });
 */

  /*it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));*/
  /* it('should render title in a h1 tag', async(() => {
     const fixture = TestBed.createComponent(AppComponent);
     fixture.detectChanges();
     const compiled = fixture.debugElement.nativeElement;
     expect(compiled.querySelector('h1').textContent).toContain('Welcome to solid-app!');
   }));*/
});
