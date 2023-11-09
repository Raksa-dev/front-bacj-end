import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchMakingComponent } from './match-making.component';

describe('MatchMakingComponent', () => {
  let component: MatchMakingComponent;
  let fixture: ComponentFixture<MatchMakingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchMakingComponent]
    });
    fixture = TestBed.createComponent(MatchMakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
