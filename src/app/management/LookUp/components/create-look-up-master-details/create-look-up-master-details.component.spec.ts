import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLookUpMasterDetailsComponent } from './create-look-up-master-details.component';

describe('CreateLookUpMasterDetailsComponent', () => {
  let component: CreateLookUpMasterDetailsComponent;
  let fixture: ComponentFixture<CreateLookUpMasterDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateLookUpMasterDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateLookUpMasterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
