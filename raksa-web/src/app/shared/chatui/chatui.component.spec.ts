import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatuiComponent } from './chatui.component';

describe('ChatuiComponent', () => {
  let component: ChatuiComponent;
  let fixture: ComponentFixture<ChatuiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatuiComponent]
    });
    fixture = TestBed.createComponent(ChatuiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
