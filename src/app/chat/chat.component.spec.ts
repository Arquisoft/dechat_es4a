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
import {Router} from "@angular/router";
import {RdfService} from "../services/rdf.service";

describe('ChatComponent', () => {
    let component: ChatComponent;
    let fixture: ComponentFixture<ChatComponent>;

    beforeEach(async(() => {





        TestBed.configureTestingModule({
            imports: [  BrowserAnimationsModule, ToastrModule.forRoot(), ShContextMenuModule, VgCoreModule,
                VgControlsModule, VgOverlayPlayModule, VgBufferingModule, VgStreamingModule, RouterTestingModule,
            ],
            declarations: [ ChatComponent ],
            providers: [ ToastrService , RdfService],
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



    it('have to contain 0 friend', () => {
        component.loadProfile();
        expect(component.amigos.length).toBe(0);
    });

    it('have to contain 1 friend', () => {
        component.loadProfile();
        //hay que precargar un perfil
        //component.addFriend();
        expect(component.amigos.length).toBe(1);
    });

    describe('Send the message', () => {


        it('check the button call the function', () => {
            spyOn(component, 'send');
            const boton = fixture.debugElement.query(By.html(chatButton)).nativeElement;
            boton.click();
            expect(component.send).toHaveBeenCalledTimes(1);

        });

        it('send method should call the chat service', () => {
            const chat: ChatService = fixture.debugElement.injector.get(ChatService);
            spyOn(chat, 'send');
            component.send();
            expect(chat.send).toHaveBeenCalledTimes(1);

        });

        it('getPicture must return the profile photo', () => {
             'https://davidcr98.solid.community/profile/card#me';
            expect(component.getProfilePicture(user)).toBe('https://yagoprado.solid.community/profile/perfil.jpeg');

        });

        it('initSelection must put receiver ', () => {
            const chat: ChatService = fixture.debugElement.injector.get(ChatService);
            spyOn(chat, 'initChat');
            component.initSelection('https://fooroute')
            expect(chat.initChat).toHaveBeenCalledTimes(1);
            expect(document.getElementById('receiver').innerHTML).toBe(name);

        });

        it('actualizar should update the message list ', () => {
            const chat: ChatService = fixture.debugElement.injector.get(ChatService);
            //spyOn(chat, 'actualizar');
            //spyOn(chat, 'order');
            component.actualizar();
            expect (component.messages).toEqual([]);
            //expect(chat.actualizar).toHaveBeenCalledTimes(1);

        });



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
