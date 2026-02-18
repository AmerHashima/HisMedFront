import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppotntmentFormComponent } from './appotntment-form.component';

describe('AppotntmentFormComponent', () => {
  let component: AppotntmentFormComponent;
  let fixture: ComponentFixture<AppotntmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppotntmentFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppotntmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
