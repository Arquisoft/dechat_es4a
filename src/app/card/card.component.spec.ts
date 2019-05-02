import {TestBed,async, ComponentFixture} from '@angular/core/testing';
import {AuthService} from '../services/solid.auth.service';
import {CardComponent} from './card.component';
import { RouterTestingModule } from '@angular/router/testing'
import { DebugElement } from '@angular/core';
import { BrowserModule, By } from '@angular/platform-browser';
import { SolidChat } from '../models/solid-chat.model';
import { RdfService } from '../services/rdf.service';

import { ToastrModule, ToastrService} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";


describe('CardComponent',() =>{
	let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
	let auth: AuthService;	
	let debugElement: DebugElement;
	
	beforeEach(async(()=>{
		TestBed.configureTestingModule({
            imports: [    
                RouterTestingModule, BrowserAnimationsModule, ToastrModule.forRoot()
              ],
			declarations: [
                CardComponent
						],
		}).compileComponents();
	}));
	
	beforeEach(() =>{
		fixture = TestBed.createComponent(CardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});
	
	it('should create',async(()=>{
		expect(component).toBeTruthy();
	}));

	it('should rotate images',async(()=>{
		component.state = 'default';
		component.rotate();
		expect(component.state).toBe('rotated');
	}));

	it('should create profile',async(()=>{
		component.profile ={
			fn: 'fn',
			company: 'organization-name',
			phone: '11111',
			role: 'role',
			image: 'hasPhoto',
			address: {},
			email: 'email@email.com',
		}
		fixture.detectChanges();
		expect(component).toBeTruthy();
	}));

	it('should change profile images',()=>{
		component.profile ={
			fn: 'fn',
			company: 'organization-name',
			phone: '11111',
			role: 'role',
			image: 'hasPhoto',
			address: {},
			email: 'email@email.com',
		}
		component.setupProfileData();
		expect(component.profileImage).toBe('hasPhoto');
	});

	it('should create an instance of Solid Chat model', () => {
		const chat = new SolidChat('user1', 'user2');
		expect(chat).toBeTruthy();
});

it('should return values from Solid Chat model', () => {
		const chat = new SolidChat('user1', 'user2');
		expect(chat).toBeTruthy();
		expect(chat.clientId).toBe('user1');
		expect(chat.friendId).toBe('user2');
});

	afterAll(() => {
		TestBed.resetTestingModule();
	  });
});