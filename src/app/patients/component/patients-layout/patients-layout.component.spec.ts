import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsLayoutComponent } from './patients-layout.component';

describe('PatientsLayoutComponent', () => {
  let component: PatientsLayoutComponent;
  let fixture: ComponentFixture<PatientsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientsLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
