import { map } from 'rxjs/internal/operators';
import { REFRESH_DURATION, TimerService } from '../../../../core/timer.service';
import { PowerHttpService } from '../power-http.service';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { PowerOverviewModalListenerService } from '../power-overview-modal-listener.service';

@Component({
  selector: 'app-power-total-info',
  templateUrl: './power-total-info.component.html',
  styleUrls: ['./power-total-info.component.less']
})
export class PowerTotalInfoComponent implements OnInit, OnDestroy {
  public powerTotalInfo = new PowerInfoDataItem();

  private dataSubscription: Subscription;
  private timerSubscription: Subscription;

  // 获取当前时间戳
  private get CurrentStamp() {
    return Math.round(new Date().getTime() / 1000);
  }

  // 获取今日零点时间戳
  private get CurrentZeroStamp() {
    return Math.round(new Date(new Date().toDateString()).getTime() / 1000);
  }

  // 获取当月零点时间戳
  private get CurrentMothStamp() {
    const data = new Date();
    data.setDate(1);
    data.setHours(0);
    data.setSeconds(0);
    data.setMinutes(0);
    return Math.round(data.getTime() / 1000);
  }

  // 获取当年零点时间戳
  private get CurrentYearStamp() {
    const firstDay = new Date();
    firstDay.setDate(1);
    firstDay.setMonth(0);
    firstDay.setHours(0);
    firstDay.setSeconds(0);
    firstDay.setMinutes(0);
    return Math.round(firstDay.getTime() / 1000);
  }

  @ViewChild('powerTotalInfoRef') public powerTotalInfoRef: ElementRef;
  constructor(
    private powerOverviewModalListenerService: PowerOverviewModalListenerService,
    private powerService: PowerHttpService,
    private timerService: TimerService
  ) { }

  ngOnInit(): void {
    this.requestAllData();

    this.timerSubscription = this.timerService.intervalTime(REFRESH_DURATION).subscribe(() => {
      this.requestAllData();
    });
  }

  public requestAllData() {
    const current_year_section = `${this.CurrentYearStamp},${this.CurrentStamp}`;
    const current_day_section = `${this.CurrentZeroStamp},${this.CurrentStamp}`;
    const current_month_section = `${this.CurrentMothStamp},${this.CurrentStamp}`;

    // 新能源汽车总数
    const http1 = this.powerService.requestTotalCarCount();
    // 充电用户数
    const http2 = this.powerService.requestChargingUserCount();
    // 总充电桩数
    const http3 = this.powerService.requestPoleCountsByType();
    // 本年充电次数
    const http4 = this.powerService.requestChargingCount(current_year_section);
    // 本月充电次数
    const http5 = this.powerService.requestChargingCount(current_month_section);
    // 今日充电次数
    const http6 = this.powerService.requestChargingCount(current_day_section);
    // 本年充电量
    const http7 = this.powerService.requestChargingVolume(current_year_section);
    // 本月充电量
    const http8 = this.powerService.requestChargingVolume(current_month_section);
    // 今日充电量
    const http9 = this.powerService.requestChargingVolume(current_day_section);
    // 本年充电金额
    const http10 = this.powerService.requstChargingAmount(current_year_section);
    // 充电站数
    const http11 = this.powerService.requestChargingStationCount();

    const httpList = [http1, http2, http3, http4, http5, http6, http7, http8, http9, http10, http11];
    this.dataSubscription = forkJoin(httpList).subscribe((results: any[]) => {
      let totalPoleCount = 0;
      results[2].results.map(item => totalPoleCount += item.count);
      this.powerTotalInfo = new PowerInfoDataItem(
        15098,
        results[1].body.count,
        totalPoleCount,
        results[3].body.count,
        results[4].body.count,
        results[5].body.count,
        results[6].body.count,
        results[7].body.count,
        results[8].body.count,
        results[9].body.charging_amount / 10000,
        results[10].body.count
      );

    });
  }

  public onBtnClick(value: string) {
    this.powerOverviewModalListenerService.powerOverviewModalClick$.next(value);
  }

  public ngOnDestroy() {
    this.dataSubscription && this.dataSubscription.unsubscribe();
    this.timerSubscription && this.timerSubscription.unsubscribe();
  }

}

export class PowerInfoDataItem {
  totalCarCount: string;
  chargingUserCount: string;
  chargingPoleCount: string;
  chargingCountByYear: string;
  chargingCountByMonth: string;
  chargingCountByDay: string;
  chargingVolumeByDay: string;
  chargingVolumeByMonth: string;
  chargingVolumeByYear: string;
  chargingAmountByYear: string;
  chargingStationCount: string;

  constructor(
    totalCarCount?: number,
    chargingUserCount?: number,
    chargingPoleCount?: number,
    chargingCountByYear?: number,
    chargingCountByMonth?: number,
    chargingCountByDay?: number,
    chargingVolumeByYear?: number,
    chargingVolumeByMonth?: number,
    chargingVolumeByDay?: number,
    chargingAmountByYear?: number,
    chargingStationCount?: number,
  ) {
    this.totalCarCount = totalCarCount && Math.floor(totalCarCount).toString() || '0';
    this.chargingUserCount = chargingUserCount && Math.floor(chargingUserCount).toString() || '0';
    this.chargingPoleCount = chargingPoleCount && Math.floor(chargingPoleCount).toString() || '0';
    this.chargingCountByYear = chargingCountByYear && Math.floor(chargingCountByYear).toString() || '0';
    this.chargingCountByMonth = chargingCountByMonth && Math.floor(chargingCountByMonth).toString() || '0';
    this.chargingCountByDay = chargingCountByDay && Math.floor(chargingCountByDay).toString() || '0';
    this.chargingVolumeByDay = chargingVolumeByDay && Math.floor(chargingVolumeByDay).toString() || '0';
    this.chargingVolumeByMonth = chargingVolumeByMonth && Math.floor(chargingVolumeByMonth).toString() || '0';
    this.chargingVolumeByYear = chargingVolumeByYear && Math.floor(chargingVolumeByYear).toString() || '0';
    this.chargingAmountByYear = chargingAmountByYear && Math.floor(chargingAmountByYear).toString() || '0';
    this.chargingStationCount = chargingStationCount && Math.floor(chargingStationCount).toString() || '0';
  }
}
