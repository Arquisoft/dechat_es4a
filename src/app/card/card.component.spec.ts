import {TestBed,async, ComponentFixture} from '@angular/core/testing';
import {AuthService} from '../services/solid.auth.service';
import {CardComponent} from './card.component';
import { RouterTestingModule } from '@angular/router/testing'
import { DebugElement } from '@angular/core';
import { BrowserModule, By } from '@angular/platform-browser';


describe('CardComponent',() =>{
	let component: CardComponent;
    let fixture: ComponentFixture<CardComponent>;
	let auth: AuthService;	
	
	beforeEach(async(()=>{
		TestBed.configureTestingModule({
            imports: [    
                RouterTestingModule    
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
});