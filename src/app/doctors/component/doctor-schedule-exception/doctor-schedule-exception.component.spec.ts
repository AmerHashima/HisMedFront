import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorScheduleExceptionComponent } from './doctor-schedule-exception.component';

describe('DoctorScheduleExceptionComponent', () => {
  let component: DoctorScheduleExceptionComponent;
  let fixture: ComponentFixture<DoctorScheduleExceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorScheduleExceptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorScheduleExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
