import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingAssessmentScoreTableComponent } from './parking-assessment-score-table.component';

describe('ParkingAssessmentScoreTableComponent', () => {
  let component: ParkingAssessmentScoreTableComponent;
  let fixture: ComponentFixture<ParkingAssessmentScoreTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParkingAssessmentScoreTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingAssessmentScoreTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
