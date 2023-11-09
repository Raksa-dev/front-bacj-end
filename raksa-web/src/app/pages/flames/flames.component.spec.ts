import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlamesComponent } from './flames.component';

describe('FlamesComponent', () => {
  let component: FlamesComponent;
  let fixture: ComponentFixture<FlamesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlamesComponent]
    });
    fixture = TestBed.createComponent(FlamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
