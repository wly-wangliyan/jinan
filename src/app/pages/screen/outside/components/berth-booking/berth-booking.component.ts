import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ListScrollService,
  RollDataItem,
} from '../../../../../core/list-scroll.service';
import { Subscription, timer } from 'rxjs';
import districts from '../../../home/map-districts';
import {
  OutsideHttpService,
  ParkingReservationSpotEntity,
  ReservationRecordEntity,
  ReservationRecordParams,
  ReservationSpotParams,
} from '../../outside-http.service';
import { TimerService } from '../../../../../core/timer.service';

const MAX_LIST_COUNT = 6;
const ROW_HEIGHT = 30;

@Component({
  selector: 'app-berth-booking',
  templateUrl: './berth-booking.component.html',
  styleUrls: ['./berth-booking.component.less'],
  providers: [ListScrollService],
})
export class BerthBookingComponent implements OnInit, AfterViewInit, OnDestroy {
  public chartOptions: any;
  public chartInstance: any;

  public districts = districts;

  public reservationPercent = 0; // 预约百分比
  public reservationSpots: ParkingReservationSpotEntity = new ParkingReservationSpotEntity();

  public searchParams: ReservationRecordParams = new ReservationRecordParams();
  public searchSpotParams: ReservationSpotParams = new ReservationSpotParams();
  public dataList: Array<RollDataItem> = [];
  private newDataList: Array<ReservationRecordEntity> = [];
  private needUpdate = false; // 是否需要更新数据
  private isAppendDataOperation = false; // 是否在追加数据操作中

  @ViewChild('scrollDiv') private scrollDiv: ElementRef;
  private dataSubscription: Subscription;
  private timerSubscription: Subscription;

  constructor(
    private listScrollService: ListScrollService,
    private timerService: TimerService,
    private outsideHttpService: OutsideHttpService
  ) {
    this.searchParams.reservation_status = 1;
    listScrollService.loadMoreData$.subscribe(() => {
      this.continueAppendData();
    });
    this.timerSubscription = timerService
      .intervalTime(10 * 60 * 1000)
      .subscribe(() => {
        if (this.dataList.length > MAX_LIST_COUNT) {
          this.needUpdate = true;
        } else {
          this.requestParkingReservationRecordInfo();
        }
        this.requestParkingReservationSpots();
      });
  }

  ngOnInit(): void {
    this.requestParkingReservationRecordInfo();
    this.requestParkingReservationSpots();
  }

  public ngAfterViewInit() {
    if (this.dataList.length > MAX_LIST_COUNT) {
      // 列表显示不下了才需要滚动
      this.listScrollService.startScroll();
    }
  }

  public ngOnDestroy() {
    this.listScrollService.destroyData();
    this.dataSubscription && this.dataSubscription.unsubscribe();
    this.timerSubscription && this.timerSubscription.unsubscribe();
  }

  // 辖区筛选
  public onDistrictChange(value: string) {
    this.listScrollService.stopScroll();
    this.requestParkingReservationRecordInfo();
    this.searchSpotParams.code = value;
    this.requestParkingReservationSpots();
  }

  public requestParkingReservationRecordInfo() {
    this.dataSubscription && this.dataSubscription.unsubscribe();
    this.dataSubscription = this.outsideHttpService
      .requestParkingReservationRecordInfo(this.searchParams)
      .subscribe(
        (results) => {
          if (results.length > MAX_LIST_COUNT) {
            // 列表显示不下了才需要滚动
            this.newDataList = results.concat(results); // 延长数组元素
            // 制作为UI效果定制的数据
            const rollDataList = this.convertRollData(null, this.newDataList);
            this.dataList = rollDataList;
            this.listScrollService.initData(
              ROW_HEIGHT,
              this.scrollDiv,
              this.dataList
            );
            this.listScrollService.startScroll();
          } else {
            this.dataList = this.convertRollData(null, results);
          }
        },
        (err) => {
          this.listScrollService.stopScroll();
        }
      );
  }

  public requestParkingReservationSpots() {
    this.outsideHttpService
      .requestParkingReservationSpots(this.searchSpotParams)
      .subscribe(
        (result) => {
          this.reservationSpots = result;
          // 计算预约百分比
          if (result.already_res_spots && result.total_res_spots) {
            this.reservationPercent =
              Math.round(
                (result.already_res_spots / result.total_res_spots) * 10000
              ) / 100;
          } else {
            this.reservationPercent = 0;
          }
          this.generateChart();
        },
        (err) => {}
      );
  }

  /* 继续追加数据 */
  private continueAppendData() {
    if (this.isAppendDataOperation) {
      return;
    }
    if (this.needUpdate) {
      // 需要更新
      this.isAppendDataOperation = true;
      this.dataSubscription && this.dataSubscription.unsubscribe();
      this.dataSubscription = this.outsideHttpService
        .requestParkingReservationRecordInfo(this.searchParams)
        .subscribe(
          (results) => {
            // 制作为UI效果定制的数据
            this.newDataList = results.concat(results); // 延长数组元素
            const rollDataList = this.convertRollData(
              this.dataList[this.dataList.length - 1],
              this.newDataList
            );
            rollDataList.forEach((item) => {
              this.dataList.push(item);
            });
            this.needUpdate = false;
            timer(1).subscribe(() => {
              // 为了绑定数据更新提供缓冲时间
              this.isAppendDataOperation = false;
            });
          },
          (err) => {
            this.listScrollService.stopScroll();
            timer(1).subscribe(() => {
              // 为了绑定数据更新提供缓冲时间
              this.isAppendDataOperation = false;
            });
          }
        );
    } else {
      this.appendLocalData();
      this.isAppendDataOperation = false;
    }
  }

  public onScrollDivMouseEnter() {
    this.listScrollService.pauseScroll();
  }

  public onScrollDivMouseLeave() {
    this.listScrollService.continueScroll();
  }

  private appendLocalData() {
    // 制作为UI效果定制的数据
    const rollDataList = this.convertRollData(
      this.dataList[this.dataList.length - 1],
      this.newDataList
    );
    rollDataList.forEach((item) => {
      this.dataList.push(item);
    });
  }

  /**
   * 转换数据类型
   * @param lastItem 最后一项
   * @param newDataList 新数据
   */
  private convertRollData(
    lastItem: RollDataItem,
    newDataList: Array<ReservationRecordEntity>
  ): Array<RollDataItem> {
    const rollDataList = [];
    for (const tempItem of newDataList) {
      lastItem = new RollDataItem(tempItem, lastItem ? !lastItem.isOdd : true);
      rollDataList.push(lastItem);
    }
    return rollDataList;
  }

  public onChartInit(chartInstance: any): void {
    this.chartInstance = chartInstance;
  }

  private generateChart(): void {
    this.chartOptions = {
      background: 'transparent',
      tooltip: {
        trigger: 'item',
        position: 'inside',
        textStyle: {
          fontFamily: 'Source Han Sans SC',
        },
        formatter: `预约数量：${this.reservationSpots.already_res_spots}<br/>预约占比：${this.reservationPercent}%`,
      },
      series: [
        {
          name: '预约',
          type: 'gauge',
          min: 0,
          max: 100,
          splitNumber: 5,
          radius: '80%',
          axisLine: {
            // 坐标轴线
            lineStyle: {
              // 属性lineStyle控制线条样式
              color: [
                [0.2, '#FFFFFF'],
                [0.4, '#B5CCFF'],
                [0.6, '#759FFF'],
                [0.8, '#3271FF'],
                [1, '#003FCD'],
              ],
              width: 2,
              shadowColor: '#fff', // 默认透明
              shadowBlur: 10,
            },
          },
          axisLabel: {
            // 坐标轴小标记
            fontWeight: 'bold',
            fontFamily: 'Source Han Sans SC',
            color: '#fff',
            shadowColor: '#fff', // 默认透明
            shadowBlur: 10,
          },
          axisTick: {
            // 坐标轴小标记
            length: 5, // 属性length控制线长
            lineStyle: {
              // 属性lineStyle控制线条样式
              color: 'auto',
              shadowColor: '#fff', // 默认透明
              shadowBlur: 10,
            },
          },
          splitLine: {
            // 分隔线
            length: 5, // 属性length控制线长
            lineStyle: {
              // 属性lineStyle（详见lineStyle）控制线条样式
              width: 3,
              color: '#fff',
              shadowColor: '#fff', // 默认透明
              shadowBlur: 10,
            },
          },
          pointer: {
            // 分隔线
            shadowColor: '#fff', // 默认透明
            shadowBlur: 5,
            width: 3,
          },
          title: {
            textStyle: {
              // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bold',
              fontSize: 20,
              fontStyle: 'italic',
              color: '#fff',
              shadowColor: '#fff', // 默认透明
              shadowBlur: 10,
              fontFamily: 'Source Han Sans SC',
            },
          },
          detail: {
            offsetCenter: [0, '70%'], // x, y，单位px
            textStyle: {
              // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              color: '#fff',
            },
            fontFamily: 'electronicFont',
            formatter: `${this.reservationSpots.already_res_spots}`
          },
          data: [
            {
              value:
                this.reservationSpots.already_res_spots > 100
                  ? 100
                  : this.reservationSpots.already_res_spots,
              name: '',
            },
          ],
        },
      ],
    };
    this.chartInstance && this.chartInstance.setOption(this.chartOptions, true);
  }
}
