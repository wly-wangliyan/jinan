import { BicycleRecordsEntity, BikeHttpService } from '../bike-http.service';
import { Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TimerService } from '../../../../core/timer.service';

@Component({
  selector: 'app-bicycle-record',
  templateUrl: './bicycle-record.component.html',
  styleUrls: ['./bicycle-record.component.less', '../bike.component.less']
})
export class BicycleRecordComponent implements OnInit, OnDestroy {

  public dataList: Array<BicycleRecordsEntity> = [];

  private dataSubscription: Subscription;
  private timerSubscription: Subscription;

  constructor(
    private service: BikeHttpService,
    private timerService: TimerService
  ) {
    this.timerSubscription = this.timerService.intervalTime(10 * 60 * 1000).subscribe(() => {
      this.getBicycleRecordsList();
    });
  }

  ngOnInit(): void {
    this.getBicycleRecordsList();
  }

  public getBicycleRecordsList() {
    this.dataSubscription = this.service.requestBicycleRecords().subscribe(res => {
      this.dataList = res.results;
    });
  }

  ngOnDestroy() {
    this.timerSubscription && this.timerSubscription.unsubscribe();
    this.dataSubscription && this.dataSubscription.unsubscribe();
  }
}
