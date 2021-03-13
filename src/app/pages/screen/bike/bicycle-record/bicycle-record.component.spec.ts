import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BicycleRecordComponent } from './bicycle-record.component';

describe('BicycleRecordComponent', () => {
  let component: BicycleRecordComponent;
  let fixture: ComponentFixture<BicycleRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BicycleRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BicycleRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
