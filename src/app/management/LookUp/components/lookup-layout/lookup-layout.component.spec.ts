import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupLayoutComponent } from './lookup-layout.component';

describe('LookupLayoutComponent', () => {
  let component: LookupLayoutComponent;
  let fixture: ComponentFixture<LookupLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LookupLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LookupLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
