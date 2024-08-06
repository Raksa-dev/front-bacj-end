import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurphilosophyComponent } from './ourphilosophy.component';

describe('OurphilosophyComponent', () => {
  let component: OurphilosophyComponent;
  let fixture: ComponentFixture<OurphilosophyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OurphilosophyComponent]
    });
    fixture = TestBed.createComponent(OurphilosophyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
