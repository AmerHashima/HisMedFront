import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingpageLayoutComponent } from './landingpage-layout.component';

describe('LandingpageLayoutComponent', () => {
  let component: LandingpageLayoutComponent;
  let fixture: ComponentFixture<LandingpageLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [LandingpageLayoutComponent]
});
    fixture = TestBed.createComponent(LandingpageLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
