import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingTurnoverRateAndUtilizationRateComponent } from './parking-turnover-rate-and-utilization-rate.component';

describe('ParkingTurnoverRateAndUtilizationRateComponent', () => {
  let component: ParkingTurnoverRateAndUtilizationRateComponent;
  let fixture: ComponentFixture<ParkingTurnoverRateAndUtilizationRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParkingTurnoverRateAndUtilizationRateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingTurnoverRateAndUtilizationRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
