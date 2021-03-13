import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictRoadTypeSummaryComponent } from './district-road-type-summary.component';

describe('DistrictRoadTypeSummaryComponent', () => {
  let component: DistrictRoadTypeSummaryComponent;
  let fixture: ComponentFixture<DistrictRoadTypeSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistrictRoadTypeSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictRoadTypeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
