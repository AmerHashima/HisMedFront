import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllLooksupsComponent } from './all-looksups.component';

describe('AllLooksupsComponent', () => {
  let component: AllLooksupsComponent;
  let fixture: ComponentFixture<AllLooksupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllLooksupsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllLooksupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
