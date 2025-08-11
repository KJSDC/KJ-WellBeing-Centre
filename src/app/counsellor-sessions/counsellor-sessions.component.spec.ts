import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounsellorSessionsComponent } from './counsellor-sessions.component';

describe('CounsellorSessionsComponent', () => {
  let component: CounsellorSessionsComponent;
  let fixture: ComponentFixture<CounsellorSessionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CounsellorSessionsComponent]
    });
    fixture = TestBed.createComponent(CounsellorSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
