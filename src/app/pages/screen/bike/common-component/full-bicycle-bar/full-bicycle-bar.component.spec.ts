import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FullBicycleBarComponent } from './full-bicycle-bar.component';

describe('FullBicycleBarComponent', () => {
  let component: FullBicycleBarComponent;
  let fixture: ComponentFixture<FullBicycleBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FullBicycleBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullBicycleBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
