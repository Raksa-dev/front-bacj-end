import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewlandingpageComponent } from './newlandingpage.component';

describe('NewlandingpageComponent', () => {
  let component: NewlandingpageComponent;
  let fixture: ComponentFixture<NewlandingpageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewlandingpageComponent]
    });
    fixture = TestBed.createComponent(NewlandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
