import { REFRESH_DURATION } from '../../../../../core/timer.service';
import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import echarts from 'echarts';
import { Subscription } from 'rxjs';
import { OutsideHttpService, ParkingEntity, ParkingParams, ParkingStaticEntity } from '../../outside-http.service';
import { isNullOrUndefined } from 'util';
import { TimerService } from '../../../../../core/timer.service';
import { OfflineWarningComponent } from '../offline-warning/offline-warning.component';

@Component({
  selector: 'app-parking-info',
  templateUrl: './parking-info.component.html',
  styleUrls: ['./parking-info.component.less']
})
export class ParkingInfoComponent implements OnInit, OnDestroy {

  @Output() public parkingFieldChange = new EventEmitter();

  @ViewChild('totalInfo') private totalInfoRef: ElementRef;

  @ViewChild('detailInfo') private detailInfoRef: ElementRef;

  @ViewChild('offlineWarn') private offlineWarnRef: ElementRef;

  @ViewChild(OfflineWarningComponent) private offlineWarningCpt: OfflineWarningComponent;

  public chartOptions: any;

  public chartInstance: any;

  public parkingStaticInfo: ParkingStaticEntity = new ParkingStaticEntity();

  public parkingList: Array<ParkingEntity> = [];

  public fieldParkingList: Array<FieldParkingItem> = [];

  private timerSubscription: Subscription;

  private isLoadingMore = false; // 加载下一页数据中
  private linkUrl = null;

  constructor(private renderer2: Renderer2,
              private timerService: TimerService,
              private outsideHttpService: OutsideHttpService) {
    this.timerSubscription = this.timerService.intervalTime(REFRESH_DURATION).subscribe(() => {
      this.requestParkingStaticData();
      this.requestParkingList();
      this.requestFieldParkingCountInfo();
    });
  }

  ngOnInit(): void {
    this.requestParkingStaticData();
    this.requestParkingList();
    this.requestFieldParkingCountInfo();
  }

  public ngOnDestroy(): void {
    this.timerSubscription && this.timerSubscription.unsubscribe();
  }

  public toString(value: any) {
    if (isNullOrUndefined(value)) {
      return '';
    }
    return String(value);
  }

  public onScroll(scrollElement: any) {
    if (scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight - 1) {
      if (this.linkUrl && !this.isLoadingMore) {
        this.isLoadingMore = true;
        this.outsideHttpService.continueRequestParkingInfoList(this.linkUrl).subscribe(data => {
          data.results.forEach(item => {
            this.parkingList.push(item);
          });
          this.linkUrl = data.linkUrl;
          this.isLoadingMore = false;
        }, () => {
          this.isLoadingMore = false;
        });
      }
    }
  }

  // 停车场信息
  public requestParkingStaticData() {
    this.outsideHttpService.requestParkingStaticInfo().subscribe(result => {
      this.parkingStaticInfo = result;
    }, err => {

    });
  }

  // 获取路外停车场列表
  public requestParkingList() {
    const params = new ParkingParams();
    params.parking_type = 2;
    this.outsideHttpService.requestParkingInfoList(params).subscribe(data => {
      this.parkingList = data.results;
      this.linkUrl = data.linkUrl;
    }, err => {
    });
  }

  // 各区领域停车场数量
  public requestFieldParkingCountInfo() {
    this.outsideHttpService.requestFieldParkingCountInfo().subscribe(result => {
      const fieldParkingList = this.generateFieldParkingData();
      console.log(fieldParkingList);
      result.forEach(res => {
        const item = fieldParkingList.find(park => park.parking_field === res.parking_field);
        if (item) {
          item.value = res.num;
        }
      });
      this.fieldParkingList = fieldParkingList;
      this.generateCharts();
    }, err => {

    });
  }

  // 初始化领域停车场数量
  public generateFieldParkingData(): Array<FieldParkingItem> {
    const colors = ['52, 115, 254', '255, 111, 111', '247, 181, 0', '50, 255, 180', '129, 255, 93', '204, 0, 222'];
    return Array.from({length: 6}).map((v, k) => {
      return new FieldParkingItem(k + 6, {
        color: new echarts.graphic.LinearGradient(
          0, 0, 0, 1,
          [
            {offset: 1, color: `rgba(${colors[k]}, 0)`},
            {offset: 0, color: `rgba(${colors[k]}, 1)`}
          ]
        ),
      });
    });
  }

  // 切换弹框
  /**
   * 切换弹框
   * @param isTotal 停车场信息
   * @param type 0 停车场概况 1 离线预警
   */
  public onToggle(isTotal: boolean = true, type = 0): void {
    const element = type === 0 ? this.detailInfoRef.nativeElement : this.offlineWarnRef.nativeElement;
    if (isTotal) {
      this.renderer2.setStyle(this.totalInfoRef.nativeElement, 'left', '-500px');
      this.renderer2.setStyle(element, 'left', '12px');
      type === 1 && this.offlineWarningCpt.refresh();
    } else {
      this.renderer2.setStyle(this.totalInfoRef.nativeElement, 'left', '12px');
      this.renderer2.setStyle(element, 'left', '-500px');
    }

  }


  public onChartInit(chartInstance: any): void {
    this.chartInstance = chartInstance;
  }

  // 五领域图标点击事件
  public onChartClick(parkingField: number) {
    this.parkingFieldChange.emit(parkingField);
  }

  private generateCharts(): void {
    this.chartOptions = {
      textStyle: {
        fontFamily: 'Source Han Sans SC',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          'type': 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        confine: true, // 是否将 tooltip 框限制在图表的区域内。
        formatter: '{b}：{c}个',
      },
      grid: {
        bottom: 30,
        left: 30,
        top: 80,
        containLabel: true,
      },
      calculable: true,
      xAxis: [
        {
          offset: 5,
          type: 'category',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#1995DE'
            }
          },
          axisTick: {
            show: false,
            alignWithLabel: true,
          },
          axisLabel: {
            color: '#BFE8FF',
            fontSize: 14,
            interval: 0,
            fontWeight: 'normal'
          },
          data: ['政区', '景区', '站区', '校圈', '医圈', '商圈'],
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#32FFB4',
            fontWeight: 'bold',
            fontSize: 14,
          },
          splitLine: {
            lineStyle: {
              color: ['rgba(50, 255, 180, .8)'],
            }
          },
          splitNumber: 3,
          minInterval: 1,
        }
      ],
      series: [
        {
          barWidth: 24,
          type: 'bar',
          label: {
            show: true,
            position: 'top',
            fontWeight: 'bold',
            fontSize: 14,
            color: '#fff',
            align: 'center',
          },
          data: this.fieldParkingList,
          itemStyle: {
            barBorderRadius: [12, 12, 0, 0],
          },
        },
      ]
    };
    this.chartInstance && this.chartInstance.setOption(this.chartOptions, true);
  }


}

class FieldParkingItem {
  public value = 0;
  public itemStyle: any;
  public parking_field: number = undefined;

  constructor(parking_field: number, itemStyle: any) {
    this.parking_field = parking_field;
    this.itemStyle = itemStyle;
  }
}
