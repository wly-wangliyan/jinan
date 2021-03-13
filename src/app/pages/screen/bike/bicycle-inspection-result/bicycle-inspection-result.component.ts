import { BikeHttpService, InspectionResultsEntity } from '../bike-http.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TimerService } from '../../../../core/timer.service';

@Component({
  selector: 'app-bicycle-inspection-result',
  templateUrl: './bicycle-inspection-result.component.html',
  styleUrls: ['../bike.component.less', '../bicycle-record/bicycle-record.component.less', './bicycle-inspection-result.component.less']
})
export class BicycleInspectionResultComponent implements OnInit, OnDestroy {

  public dataList: Array<InspectionResultsEntity> = [];
  private dataSubscription: Subscription;
  private timerSubscription: Subscription;

  constructor(
    private service: BikeHttpService,
    private timerService: TimerService
  ) {
    this.timerSubscription = this.timerService.intervalTime(10 * 60 * 1000).subscribe(() => {
      this.getInspectionResults();
    });
  }

  ngOnInit(): void {
    this.getInspectionResults();
  }

  public getInspectionResults() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const monthSection = `${new Date(currentYear, currentMonth - 1).getTime() / 1000},${currentDate.getTime() / 1000}`;
    this.dataSubscription = this.service.requestInspectionResults(monthSection).subscribe(res => {
      this.dataList = res.results;
    });
  }

  ngOnDestroy() {
    this.dataSubscription && this.dataSubscription.unsubscribe();
    this.timerSubscription && this.timerSubscription.unsubscribe();
  }

}
