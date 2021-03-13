import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BicycleAreaNumComponent } from './bicycle-area-num.component';

describe('BicycleAreaNumComponent', () => {
  let component: BicycleAreaNumComponent;
  let fixture: ComponentFixture<BicycleAreaNumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BicycleAreaNumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BicycleAreaNumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
