import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutCallComponent } from './about.component';

describe('AboutCallComponent', () => {
  let component: AboutCallComponent;
  let fixture: ComponentFixture<AboutCallComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AboutCallComponent],
    });
    fixture = TestBed.createComponent(AboutCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
