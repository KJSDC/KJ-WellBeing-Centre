import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentGridComponent } from './student-grid.component';

describe('StudentGridComponent', () => {
  let component: StudentGridComponent;
  let fixture: ComponentFixture<StudentGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentGridComponent]
    });
    fixture = TestBed.createComponent(StudentGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
