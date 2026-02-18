import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialityFormComponent } from './speciality-form.component';

describe('SpecialityFormComponent', () => {
  let component: SpecialityFormComponent;
  let fixture: ComponentFixture<SpecialityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialityFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
