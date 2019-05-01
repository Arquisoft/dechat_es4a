import {TestBed,async, ComponentFixture} from '@angular/core/testing';
import {AuthService} from '../services/solid.auth.service';
import {CardComponent} from './card.component';
import { RouterTestingModule } from '@angular/router/testing'
import { DebugElement } from '@angular/core';
import { BrowserModule, By } from '@angular/platform-browser';
import { SolidProfile } from '../models/solid-profile.model';

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

	afterAll(() => {
		TestBed.resetTestingModule();
	  });
});