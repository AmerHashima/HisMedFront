import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingDayCardComponent } from './working-day-card.component';

describe('WorkingDayCardComponent', () => {
  let component: WorkingDayCardComponent;
  let fixture: ComponentFixture<WorkingDayCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkingDayCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkingDayCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
