import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounsellorSidebarComponent } from './counsellor-sidebar.component';

describe('CounsellorSidebarComponent', () => {
  let component: CounsellorSidebarComponent;
  let fixture: ComponentFixture<CounsellorSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CounsellorSidebarComponent]
    });
    fixture = TestBed.createComponent(CounsellorSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
