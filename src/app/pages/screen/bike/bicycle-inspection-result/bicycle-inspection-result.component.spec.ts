import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BicycleInspectionResultComponent } from './bicycle-inspection-result.component';

describe('BicycleInspectionResultComponent', () => {
  let component: BicycleInspectionResultComponent;
  let fixture: ComponentFixture<BicycleInspectionResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BicycleInspectionResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BicycleInspectionResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
