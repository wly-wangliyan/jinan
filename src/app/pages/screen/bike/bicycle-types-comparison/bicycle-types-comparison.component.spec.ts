import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BicycleTypesComparisonComponent } from './bicycle-types-comparison.component';

describe('BicycleTypesComparisonComponent', () => {
  let component: BicycleTypesComparisonComponent;
  let fixture: ComponentFixture<BicycleTypesComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BicycleTypesComparisonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BicycleTypesComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
