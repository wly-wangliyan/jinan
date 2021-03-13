import { TimerService } from '../../../../core/timer.service';
import { BikeHttpService, RegionLabelCountEntity } from '../bike-http.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BicycleAreaNumListenerService } from '../bicycle-area-num-listener.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bicycle-area-num',
  templateUrl: './bicycle-area-num.component.html',
  styleUrls: ['./bicycle-area-num.component.less', '../bike.component.less']
})
export class BicycleAreaNumComponent implements OnInit, OnDestroy {
  public tmpRegionLabelList: Array<RegionLabelCountEntity> = [];

  private dataSubscription: Subscription;
  private timerSubscription: Subscription;

  constructor(
    private bicycleAreaNumListenerSerivice: BicycleAreaNumListenerService,
    private service: BikeHttpService,
    private timerService: TimerService
  ) {
    this.timerSubscription = this.timerService.intervalTime(10 * 60 * 1000).subscribe(() => {
      this.getRegionLabelCounts();
    });
  }

  ngOnInit(): void {
    this.getRegionLabelCounts();
  }

  public onAreaBickNumDivClick(id: string, name: string, region_ids: Array<string>) {
    this.bicycleAreaNumListenerSerivice.areaBicycleNumDivClick$.next({ id, name, region_ids });
  }

  public getRegionLabelCounts() {
    this.dataSubscription = this.service.requestRegionLabelCount().subscribe(res => {
      this.tmpRegionLabelList = res.results;
      this.tmpRegionLabelList.map(item => {
        item.tmpNum = item.count && item.count.toString();
      });
    });
  }

  ngOnDestroy() {
    this.dataSubscription && this.dataSubscription.unsubscribe();
    this.timerSubscription && this.timerSubscription.unsubscribe();
  }

}
