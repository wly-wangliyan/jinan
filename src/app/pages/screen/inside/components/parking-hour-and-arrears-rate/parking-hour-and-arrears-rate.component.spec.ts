import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingHourAndArrearsRateComponent } from './parking-hour-and-arrears-rate.component';

describe('ParkingHourAndArrearsRateComponent', () => {
  let component: ParkingHourAndArrearsRateComponent;
  let fixture: ComponentFixture<ParkingHourAndArrearsRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParkingHourAndArrearsRateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingHourAndArrearsRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
