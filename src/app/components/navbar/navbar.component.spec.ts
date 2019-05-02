import { async, ComponentFixture, TestBed,inject } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import {ToastrModule} from 'ngx-toastr';
import { Router } from '@angular/router'

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let el: HTMLElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,ToastrModule.forRoot()],
      declarations: [ NavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*it('Should navigate to chat', inject([Router],(router:Router)=>{
    const spy = spyOn(router, 'navigateByUrl');
    el.click();
    const navArgs = spy.calls.first().args[0];
    expect(navArgs).toBe('/chat');

  }))*/  
});
