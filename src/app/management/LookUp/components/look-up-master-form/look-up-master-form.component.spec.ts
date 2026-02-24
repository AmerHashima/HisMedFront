import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookUpMasterFormComponent } from './look-up-master-form.component';

describe('LookUpMasterFormComponent', () => {
  let component: LookUpMasterFormComponent;
  let fixture: ComponentFixture<LookUpMasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LookUpMasterFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LookUpMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
