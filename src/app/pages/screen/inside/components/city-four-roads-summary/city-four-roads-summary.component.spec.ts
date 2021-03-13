import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityFourRoadsSummaryComponent } from './city-four-roads-summary.component';

describe('CityFourRoadsSummaryComponent', () => {
  let component: CityFourRoadsSummaryComponent;
  let fixture: ComponentFixture<CityFourRoadsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CityFourRoadsSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CityFourRoadsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
