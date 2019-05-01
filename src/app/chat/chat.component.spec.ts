import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatComponent } from './chat.component';

import { ToastrModule, ToastrService } from "ngx-toastr";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CUSTOM_ELEMENTS_SCHEMA, Renderer2 } from "@angular/core";
import { ShContextMenuModule } from "ng2-right-click-menu";
import { VgCoreModule } from "videogular2/core";
import { VgControlsModule } from "videogular2/controls";
import { VgOverlayPlayModule } from "videogular2/overlay-play";
import { VgBufferingModule } from "videogular2/buffering";
import { ColorSketchModule } from "ngx-color/sketch";
import { ColorTwitterModule } from "ngx-color/twitter";
import { VgStreamingModule } from "videogular2/streaming";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { RdfService } from "../services/rdf.service";
import { ChatService } from '../services/chat.service';

describe('ChatComponent', () => {
    let component: ChatComponent;
    let fixture: ComponentFixture<ChatComponent>;
    let service: RdfService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule, ToastrModule.forRoot(), ShContextMenuModule, VgCoreModule,
                VgControlsModule, VgOverlayPlayModule, VgBufferingModule, VgStreamingModule, RouterTestingModule,
            ],
            declarations: [ChatComponent],
            providers: [ToastrService, RdfService, Renderer2, ChatComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));


    beforeEach(() => {

        service = TestBed.get(RdfService);
        fixture = TestBed.createComponent(ChatComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        /*
        let store = {};
        const mockLocalStorage = {
            getWebId: () => {
                return 'https://albertong.solid.community/profile/card#me';
            },
            getOldWebId: () => {
                return 'https://albertong.solid.community/profile/card#me';
            }
        };
*/
    });
    /*
    it('should create', () => {
        expect(component).toBeTruthy();
    });
*/




    it('should return stored token from localStorage',
        () => {

            spyOn(component, 'getOldWebId').and.returnValue('https://albertong.solid.community/profile/card#me');
            spyOn(component, 'getWebId').and.returnValue('https://albertong.solid.community/profile/card#me');
            expect(component.getUsername()).toEqual('albertong');
        });

    it('should return true on the day before today',
        () => {

            expect(component.dateMessages(new Date().toISOString()));

        });

    it('should return the hour',
        () => {
            var h = new Date();
            h.setHours(0, 0, 0, 0);
            expect(component.hourMessages(h.toISOString())).toEqual("00:00");
        });
    it('should add a friend',
        () => {
            spyOn(component, 'getOldWebId').and.returnValue('https://albertong.solid.community/profile/card#me');
            spyOn(component, 'getWebId').and.returnValue('https://albertong.solid.community/profile/card#me');
            expect(component.addFriend());
        });
    it('should look for invitations',
        () => {
            spyOn(component, 'getOldWebId').and.returnValue('https://albertong.solid.community/profile/card#me');
            spyOn(component, 'getWebId').and.returnValue('https://albertong.solid.community/profile/card#me');
            expect(component.lookForInvitations());
        });


    afterEach(() => {
        if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
            (fixture.nativeElement as HTMLElement).remove();
        }
    });
    /*
    afterEach(() => {
        TestBed.resetTestingModule();
    });
    */
});
