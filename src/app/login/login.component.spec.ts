import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { LoginComponent } from './login.component';
import {CommonModule , Location} from "@angular/common";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {ToastrModule} from "ngx-toastr";
import {routes} from "../app.module";
import {LoginPopupComponent} from "../login-popup/login-popup.component";
import {CardComponent} from "../card/card.component";
import {RegisterComponent} from "../register/register.component";
import {ChatComponent} from "../chat/chat.component";
import {NavbarComponent} from "../components/navbar/navbar.component";
import {ShContextMenuModule} from "ng2-right-click-menu";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {VgCoreModule} from "videogular2/core";
import {VgControlsModule} from "videogular2/controls";
import {VgOverlayPlayModule} from "videogular2/overlay-play";
import {VgBufferingModule} from "videogular2/buffering";

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let location: Location;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ CommonModule , NgSelectModule, FormsModule, ReactiveFormsModule, ShContextMenuModule ,
                RouterTestingModule.withRoutes(routes) , ToastrModule.forRoot() , VgCoreModule, VgControlsModule,
                VgOverlayPlayModule, VgBufferingModule, ],
            declarations: [LoginComponent , LoginPopupComponent, ChatComponent, CardComponent,
                NavbarComponent, RegisterComponent ,  ],
            providers: [],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        location = TestBed.get(Location);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should take you to registration', fakeAsync(() => {

        expect(location.path()).toBe('');
        component.goToRegistration();
        tick(15000);
        fixture.detectChanges();
        expect(location.path()).toBe('/register');

    }));

    afterEach(() => {
        if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
            (fixture.nativeElement as HTMLElement).remove();
        }
    });

});
