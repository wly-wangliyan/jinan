import {TimerService} from '../../../../core/timer.service';
import {BikeHttpService} from '../bike-http.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/internal/operators';
import {DateFormatHelper} from '../../../../../utils/date-format-helper';
import {ChartXYValue, EChartHelper} from '../../../../../utils/echart-helper';
import {OrdersUtilizationStatisticsByDayEntity, SearchParams} from '../bike-http.service';
import {FullBicycleColorPipe, FullCompanyTypePipe} from '../pipes/full-screen-bicycle.pipe';

@Component({
  selector: 'app-bicycle-average-utilization',
  templateUrl: './bicycle-average-utilization.component.html',
  styleUrls: ['./bicycle-average-utilization.component.less', '../bike.component.less']
})
export class BicycleAverageUtilizationComponent implements OnInit, OnDestroy {

  public chartOptions: any;
  public chartInstance: any;
  public start_time: string;
  public end_time: string;
  public seriesList: Array<any> = [];
  public xAxisData: Array<any> = [];
  public colorData: Array<any> = [];
  public searchParams = new SearchParams();
  public ordersUtilizationStatisticsByDayList: Array<OrdersUtilizationStatisticsByDayEntity> = [];
  public companyTypeList = [0, 1, 2, 3];

  private timerSubscription: Subscription;
  private searchText$ = new Subject<any>();

  constructor(
    // private globalService: GlobalService,
    private timerService: TimerService,
    private service: BikeHttpService) {
  }

  public ngOnInit() {
    this.searchParams.section = this.initWeekDay();
    this.searchParams.company_id = '';
    for (let index = 0; index < 7; index++) {
      this.xAxisData.push(DateFormatHelper.Format(Number(this.start_time) * 1000 + index * 24 * 60 * 60 * 1000, 'MM/dd'));
    }
    this.searchText$
      .pipe(
        debounceTime(500),
        switchMap(() =>
          this.service.requestOrdersUtilizationStatisticsByDayList(this.searchParams)
        )
      )
      .subscribe(
        res => {
          this.ordersUtilizationStatisticsByDayList = res.results;
          this.handelStatisticsData();
        },
        err => {
          // this.globalService.httpErrorProcess(err);
        }
      );
    this.searchText$.next();
    this.timerSubscription = this.timerService.intervalTime(10 * 60 * 1000).subscribe(() => {
      this.searchText$.next();
    });
  }

  // ??????????????????????????????
  private handelStatisticsData() {
    this.seriesList = this.companyTypeList.map(type => {
      const newList = [];
      this.ordersUtilizationStatisticsByDayList.map(item => {
        if (type === item.company_type) {
          newList.push(item);
        }
      });
      return {
        name: new FullCompanyTypePipe().transform(type),
        color: new FullBicycleColorPipe().transform(type),
        list: newList
      };
    });
    const array = new Array<ChartXYValue>();
    this.xAxisData.forEach(item => {
      array.push(new ChartXYValue(item, 0));
    });

    this.seriesList.forEach((item) => {
      item.list.forEach((data) => {
        const index = Math.round((data.time_point - Number(this.start_time)) / 60 / 60 / 24);
        array[index].YValue = data.utilization_rate;
      });
      item.list = EChartHelper.GenerateChartXY(array);
    });
  }

  // ???????????????
  private initWeekDay(): string {
    this.start_time = (new Date(DateFormatHelper.AWeekAgo).setHours(0, 0, 0, 0) / 1000).toString();
    this.end_time = (new Date(DateFormatHelper.Today).setHours(23, 59, 0, 0) / 1000).toString();
    return `${this.start_time},${this.end_time}`;
  }

  public ngOnDestroy() {
    this.timerSubscription && this.timerSubscription.unsubscribe();
  }

}
