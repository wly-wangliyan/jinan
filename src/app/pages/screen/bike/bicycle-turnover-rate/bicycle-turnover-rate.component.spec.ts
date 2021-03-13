import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BicycleTurnoverRateComponent } from './bicycle-turnover-rate.component';

describe('BicycleTurnoverRateComponent', () => {
  let component: BicycleTurnoverRateComponent;
  let fixture: ComponentFixture<BicycleTurnoverRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BicycleTurnoverRateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BicycleTurnoverRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
