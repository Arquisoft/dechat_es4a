import {TestBed} from '@angular/core/testing';
import {ChatComponent} from './chat.component';

describe(() => {
	let component: ChatComponent;
    let fixture: ComponentFixture<ChatComponent>;	
	
	beforeEach(async(() => {
		TestBed.configureTestModule({
			declarations: [ChatComponent],
		}).compileComponents();
	}));
	
	beforeEach(()=>{
		fixture = TestBed.createComponent(ChatComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});
	
	it('should create',() => {
		expect(component).toBeTruthy();
	});
});
