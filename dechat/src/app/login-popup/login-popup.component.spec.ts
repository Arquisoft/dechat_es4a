import {TestBed, async} from '@angular/core/testing';
import {LoginPopupComponent from} './login-popup-component';

describe('LoginPopupComponent',()=>{
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [LoginPopupComponent],
		}).compileComponents();
	}));
	
	beforeEach(() => {
		fixture = TestBed.createComponent(LoginPopupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

});