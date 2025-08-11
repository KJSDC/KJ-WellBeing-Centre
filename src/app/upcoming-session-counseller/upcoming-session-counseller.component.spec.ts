import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingSessionCounsellerComponent } from './upcoming-session-counseller.component';

describe('UpcomingSessionCounsellerComponent', () => {
  let component: UpcomingSessionCounsellerComponent;
  let fixture: ComponentFixture<UpcomingSessionCounsellerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpcomingSessionCounsellerComponent]
    });
    fixture = TestBed.createComponent(UpcomingSessionCounsellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
