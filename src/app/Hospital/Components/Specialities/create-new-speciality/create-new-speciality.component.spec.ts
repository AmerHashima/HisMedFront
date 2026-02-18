import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewSpecialityComponent } from './create-new-speciality.component';

describe('CreateNewSpecialityComponent', () => {
  let component: CreateNewSpecialityComponent;
  let fixture: ComponentFixture<CreateNewSpecialityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewSpecialityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewSpecialityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
