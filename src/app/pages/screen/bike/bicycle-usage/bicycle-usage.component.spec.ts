import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BicycleUsageComponent } from './bicycle-usage.component';

describe('BicycleUsageComponent', () => {
  let component: BicycleUsageComponent;
  let fixture: ComponentFixture<BicycleUsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BicycleUsageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BicycleUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
