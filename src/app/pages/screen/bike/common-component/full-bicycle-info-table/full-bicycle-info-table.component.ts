import { TimerService, REFRESH_DURATION } from '../../../../../core/timer.service';
import { BikeHttpService } from '../../bike-http.service';
import { Component, Input, OnInit, SimpleChange, OnDestroy, OnChanges } from '@angular/core';
import { Subscription, Subject, timer } from 'rxjs';
import { StatisticCountEntity } from '../../bike-http.service';

@Component({
  selector: 'app-full-bicycle-info-table',
  templateUrl: './full-bicycle-info-table.component.html',
  styleUrls: ['./full-bicycle-info-table.component.less']
})
export class FullBicycleInfoTableComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public splitLength = 7;
  @Input() public templateType: 'order' | 'travel';
  @Input() private companyList: Array<any> = [];
  // @Input() public set textAlign(textAlignd: string) {
  //   textAlignd === 'left' ? this.myJustifyContent = 'start' : this.myJustifyContent = 'end';
  // }

  @Input() textAlign: string;

  public myJustifyContent = '';
  public title: string;
  public templateColor: string;
  public total_num = '0';
  public background: any;
  public dataList: Array<any> = [];
  public tmpDataList = [];

  private tempCountDataList: Array<any> = [];

  private timerSubscription: Subscription;
  private dataSubscription: Subscription;
  private searchText$ = new Subject<any>();

  constructor(
    // private globalService: GlobalService,
    private timerService: TimerService,
    private service: BikeHttpService) { }

  public ngOnInit() {
    switch (this.templateType) {
      case 'order':
        this.title = '单车订单数';
        this.templateColor = '#13BBE2';
        this.background = { opacity1: 'rgba(19,187,226,0.6)', opacity2: 'rgba(19,187,226,0.4)' };
        this.searchText$.subscribe(() => {
          this.requestOrderCount();
        });
        break;
      case 'travel':
        this.title = '实时单车行驶数';
        this.templateColor = '#22FFE0';
        this.background = { opacity1: 'rgba(30,213,195,0.6)', opacity2: 'rgba(30,213,195,0.4)' };
        this.searchText$.subscribe(() => {
          this.requestTravelCount();
        });
        break;
    }
    this.searchText$.next();
    this.timerSubscription = this.timerService.intervalTime(REFRESH_DURATION).subscribe(() => {
      this.searchText$.next();
    });
  }

  // 接收到企业列表时重新渲染数据
  public ngOnChanges(changes: { [msg: string]: SimpleChange }) {
    if (changes.companyList && changes.companyList.currentValue) {
      this.generateCountData();
    }
  }

  public ngOnDestroy() {
    this.timerSubscription && this.timerSubscription.unsubscribe();
    this.dataSubscription && this.dataSubscription.unsubscribe();
  }

  // 获取单车订单数
  private requestOrderCount(): void {
    this.dataSubscription = this.service.requestBicycleOrderCountData()
      .subscribe(backData => {
        this.tempCountDataList = backData || [];
        this.generateCountData();
      }, err => {
        // this.globalService.httpErrorProcess(err);
      });
  }

  // 获取实时单车行驶中数量
  private requestTravelCount(): void {
    this.dataSubscription = this.service.requestBicycleTravelCountData()
      .subscribe(backData => {
        this.tempCountDataList = backData || [];
        this.generateCountData();
      }, err => {
        // this.globalService.httpErrorProcess(err);
      });
  }

  private generateCountData(): void {
    const tempList = [];
    let total_num = 0;
    this.companyList && this.companyList.forEach(company => {
      const dataList = this.tempCountDataList.filter(data => data.company_id === company.company_id);
      if (dataList && dataList.length > 0) {
        if (this.templateType === 'order') {
          total_num += dataList[0].order_count || 0;
        } else if (this.templateType === 'travel') {
          total_num += dataList[0].travel_count || 0;
        }
        tempList.push(dataList[0]);
      } else {
        const statisticsItem = new StatisticCountEntity();
        statisticsItem.company_id = company.company_id;
        statisticsItem.company_type = company.company_type;
        statisticsItem.travel_count = 0;
        statisticsItem.order_count = 0;
        tempList.push(statisticsItem);
      }
    });

    this.dataList = tempList;

    this.dataList.map(item => {
      item.order_count = item.order_count && item.order_count.toString() || '0';
      item.travel_count = item.travel_count && item.travel_count.toString() || '0';
    });

    // this.total_num = total_num.toString();
    this.total_num = total_num.toString();
  }

  // 企业数据按企业类型排序
  private sort(): void {
    this.dataList && this.dataList.sort((itemA, itemB) => itemA.company_type - itemB.company_type);
  }
}
