import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGridComponent } from './admin-grid.component';

describe('AdminGridComponent', () => {
  let component: AdminGridComponent;
  let fixture: ComponentFixture<AdminGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminGridComponent]
    });
    fixture = TestBed.createComponent(AdminGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
