import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageBackgroundComponent } from './image-background.component';

describe('ImageBackgroundComponent', () => {
  let component: ImageBackgroundComponent;
  let fixture: ComponentFixture<ImageBackgroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageBackgroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
