import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BicycleAverageUtilizationComponent } from './bicycle-average-utilization.component';

describe('BicycleAverageUtilizationComponent', () => {
  let component: BicycleAverageUtilizationComponent;
  let fixture: ComponentFixture<BicycleAverageUtilizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BicycleAverageUtilizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BicycleAverageUtilizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
