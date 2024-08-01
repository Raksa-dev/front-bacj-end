import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyraksaComponent } from './whyraksa.component';

describe('WhyraksaComponent', () => {
  let component: WhyraksaComponent;
  let fixture: ComponentFixture<WhyraksaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WhyraksaComponent]
    });
    fixture = TestBed.createComponent(WhyraksaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
