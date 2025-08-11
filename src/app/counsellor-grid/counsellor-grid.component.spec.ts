import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounsellorGridComponent } from './counsellor-grid.component';

describe('CounsellorGridComponent', () => {
  let component: CounsellorGridComponent;
  let fixture: ComponentFixture<CounsellorGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CounsellorGridComponent]
    });
    fixture = TestBed.createComponent(CounsellorGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
