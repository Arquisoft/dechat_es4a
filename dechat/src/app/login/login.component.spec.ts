import {TestBed,async} from '@angular/core/testing';
import {LoginComponent} from './login.component';
import { SolidProvider } from '../models/solid-provider.model';

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
	it('should have inrupt provider',async(() => {
		const fixture = TestBed.createComponent(LoginComponent);
		const component = fixture.componentInstance;
		const inruptProvider : SolidProvider {
			name: 'Inrupt';
			image: '/assets/images/Inrupt.png',
			loginUrl: 'https://inrupt.net/auth',
			desc: 'Inrupt Inc. provider'
		}
		expect(component.identityProviders.include(inruptProvider)).toBeTruthy;
	});
});