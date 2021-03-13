import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullBicycleAxisComponent } from './full-bicycle-axis.component';

describe('FullBicycleAxisComponent', () => {
  let component: FullBicycleAxisComponent;
  let fixture: ComponentFixture<FullBicycleAxisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullBicycleAxisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullBicycleAxisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
