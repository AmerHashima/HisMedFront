import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpkDashboardCardComponent } from './spk-dashboard-card.component';

describe('SpkDashboardCardComponent', () => {
  let component: SpkDashboardCardComponent;
  let fixture: ComponentFixture<SpkDashboardCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpkDashboardCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpkDashboardCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
