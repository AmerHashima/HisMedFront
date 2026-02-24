import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewLookupmasterComponent } from './create-new-lookupmaster.component';

describe('CreateNewLookupmasterComponent', () => {
  let component: CreateNewLookupmasterComponent;
  let fixture: ComponentFixture<CreateNewLookupmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewLookupmasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewLookupmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
