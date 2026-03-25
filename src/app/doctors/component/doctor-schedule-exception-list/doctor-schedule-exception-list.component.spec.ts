import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorScheduleExceptionListComponent } from './doctor-schedule-exception-list.component';

describe('DoctorScheduleExceptionListComponent', () => {
  let component: DoctorScheduleExceptionListComponent;
  let fixture: ComponentFixture<DoctorScheduleExceptionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorScheduleExceptionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorScheduleExceptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
