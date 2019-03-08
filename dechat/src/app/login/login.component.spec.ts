import {TestBed,async} from '@angular/core/testing';
import {LoginComponent} from './login.component';

describe('LoginComponent',() => {
	beforeEach(async(() => {
		TestBed.ConfigureTestingModule({
			declarations: [LoginComponent],
		}).compileComponents();
	}));

	it('should create',async(() => { 
		const fixture = TestBed.createComponent(LoginComponent);
		const component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});
});