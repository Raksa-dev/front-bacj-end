import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypewrittereffectComponent } from './typewrittereffect.component';

describe('TypewrittereffectComponent', () => {
  let component: TypewrittereffectComponent;
  let fixture: ComponentFixture<TypewrittereffectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypewrittereffectComponent]
    });
    fixture = TestBed.createComponent(TypewrittereffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
