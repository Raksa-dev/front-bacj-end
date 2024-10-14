import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserlandingpageComponent } from './userlandingpage.component';

describe('UserlandingpageComponent', () => {
  let component: UserlandingpageComponent;
  let fixture: ComponentFixture<UserlandingpageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserlandingpageComponent]
    });
    fixture = TestBed.createComponent(UserlandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
