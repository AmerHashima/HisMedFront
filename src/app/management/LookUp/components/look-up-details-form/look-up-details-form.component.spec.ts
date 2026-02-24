import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookUpDetailsFormComponent } from './look-up-details-form.component';

describe('LookUpDetailsFormComponent', () => {
  let component: LookUpDetailsFormComponent;
  let fixture: ComponentFixture<LookUpDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LookUpDetailsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LookUpDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
