import {TestBed,async} from '@angular/core/testing';
import {AuthService} from '../services/solid.auth.service';
import {CardComponent} from './card.component';


describe('CardComponent',() =>{
	let component: ChatComponent;
	let fixture: ComponentFixture<CardComponent>;
	let auth: AuthService;	
	
	beforeEach(async(()=>{
		TestBed.configureTestingModule({
			declarations: [CardComponent],
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