import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutAstrolgerComponent } from './about.component';

describe('AboutAstrolgerComponent', () => {
  let component: AboutAstrolgerComponent;
  let fixture: ComponentFixture<AboutAstrolgerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AboutAstrolgerComponent],
    });
    fixture = TestBed.createComponent(AboutAstrolgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
