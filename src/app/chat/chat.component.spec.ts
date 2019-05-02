import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatComponent } from './chat.component';

import {ToastrModule, ToastrService} from "ngx-toastr";

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {ShContextMenuModule} from "ng2-right-click-menu";
import {VgCoreModule} from "videogular2/core";
import {VgControlsModule} from "videogular2/controls";
import {VgOverlayPlayModule} from "videogular2/overlay-play";
import {VgBufferingModule} from "videogular2/buffering";
import {ColorSketchModule} from "ngx-color/sketch";
import {ColorTwitterModule} from "ngx-color/twitter";
import {VgStreamingModule} from "videogular2/streaming";
import {RouterTestingModule} from "@angular/router/testing";
import {ChatService} from '../../../bin/src/app/services/chat.service';
import {Router} from "@angular/router";
import {RdfService} from "../services/rdf.service";
import {By} from '@angular/platform-browser';
import {AuthService} from '../services/solid.auth.service';
import{SolidProfile} from '../models/solid-profile.model';
import {SolidSession} from '../models/solid-session.model';


describe('ChatComponent', () => {
    let component: ChatComponent;
    let fixture: ComponentFixture<ChatComponent>;

    beforeEach(async(() => {
         TestBed.configureTestingModule({
            imports: [  BrowserAnimationsModule, ToastrModule.forRoot(), ShContextMenuModule, VgCoreModule,
                VgControlsModule, VgOverlayPlayModule, VgBufferingModule, VgStreamingModule, RouterTestingModule,
            ],
            declarations: [ ChatComponent ],
            providers: [ ToastrService , RdfService
                ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChatComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });



   /* it('the profile no photo', () => {
        spyOn(,'getProfile').and.callThrough();
        component.loadProfile();
        expect(component.profileImage).toContain('');

    });*/



  /*  it('have to contain 1 friend', () => {
        component.loadProfile();
        component.loadFriends();
        expect(component.amigos.length).toBe(1);
    });*/

   /* it('have to change the color' ()=>{

    }); */




   /* it('check the button call the function send', () => {
            const boton = fixture.debugElement.query(By.css('chatButton')).nativeElement;
            boton.click();
            expect(component.send).toHaveBeenCalledTimes(1);

        }); */

      /*  it('send method should call the chat service', () => {
            const chat: ChatService = fixture.debugElement.injector.get(ChatService);
            spyOn(chat,'postMessage');
            component.send('hola');
            expect(chat).toHaveBeenCalledTimes(1);

        });*/

      /*  it('Check the profile photo', () => {
             const user = 'https://davidcr98.solid.community/profile/card#me';
             component.loadProfile();
             expect(component.profileImage).toBe('https://davidcr98.solid.community/profile/47240352.jpg');

        });*/

        it('create a chat ', () => {


        });

        it('refreshMessage should update the message list ', () => {
            const chat: ChatService = fixture.debugElement.injector.get(ChatService);
            //spyOn(chat, 'refreshMessages');
            component.refreshMessages();
            expect (component.messages).toEqual([]);
            //expect(chat.refreshMessages).toHaveBeenCalledTimes(1);

        });


    afterEach(() => {
        if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
            (fixture.nativeElement as HTMLElement).remove();
        }
    });
    afterEach(() => {
        TestBed.resetTestingModule();
      });
});
