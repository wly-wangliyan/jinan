import {REFRESH_DURATION, TimerService} from '../../../../core/timer.service';
import {ChargingVolumesByMonthEntity, PowerHttpService} from '../power-http.service';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {forkJoin, Subscription} from 'rxjs';

interface IMonthData {
  month: number;
  year: number;
  charging_volume: number;
}

@Component({
  selector: 'app-charging-amount',
  templateUrl: './charging-amount.component.html',
  styleUrls: ['./charging-amount.component.less']
})
export class ChargingAmountComponent implements OnInit, OnDestroy {

  public chartOptions: any;
  public dataList: Array<ChargingVolumesByMonthEntity> = [];

  private timerSubscription: Subscription;
  private dataSubscription: Subscription;

  @ViewChild('chargingAmountRef') public chargingAmountRef: ElementRef;

  constructor(private powerService: PowerHttpService, private timerService: TimerService
  ) {
    this.timerSubscription = this.timerService.intervalTime(REFRESH_DURATION).subscribe(() => {
      this.requestData();
    });
  }

  ngOnInit(): void {
    this.requestData();
  }

  ngOnDestroy() {
    this.timerSubscription && this.timerSubscription.unsubscribe();
    this.dataSubscription && this.dataSubscription.unsubscribe();
  }

  private requestData() {
    const info = this.generateData();
    const httpList = [this.powerService.requestChargingVolumesByMonth(info.yearSection),
      this.powerService.requestChargingVolume(info.monthSection)];

    this.dataSubscription = forkJoin(httpList).subscribe((results: any) => {
      const tmpDict = {};
      results[0].results.forEach((item: ChargingVolumesByMonthEntity) => {
        tmpDict[(new Date(item.time_point * 1000)).getMonth() + 1] = item.charging_volume;
      });
      info.dataList.forEach(data => {
        data.charging_volume = tmpDict[data.month] ? tmpDict[data.month] : 0;
      });
      info.dataList[11].charging_volume = results[1].body.count;
      this.generateCharts(info.dataList);
    });
  }

  private generateCharts(dataList: Array<IMonthData>) {
    this.chartOptions = {
      grid: {
        left: '5%',
        right: '10%',
        top: '20%',
        bottom: '15%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        textStyle: {
          fontFamily: 'Source Han Sans SC',
          fontWeight: 'normal'
        },
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'line' // 默认为直线，可选为：'line' | 'shadow'
        },
        confine: true, // 是否将 tooltip 框限制在图表的区域内。
        formatter: (params: any) => {
          const item = dataList[params[0].dataIndex];
          return `${item.year}-${item.month} <br/> ${params[0].seriesName}: ${params[0].data}`;
        },
      },
      xAxis: [{
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          color: '#BFE8FF',
          fontFamily: 'Source Han Sans SC',
          fontWeight: 'normal'
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#397cbc'
          }
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(25,149,222,0.4)'
          }
        },
        data: dataList.map(item => item.month)
      }],
      yAxis: [{
        type: 'value',
        name: '',
        min: 0.0,
        axisLabel: {
          formatter: '{value}',
          textStyle: {
            color: '#32FFB4',
            fontWeight: 'bold',
            fontSize: 14,
            fontFamily: 'Source Han Sans SC',
          }
        },
        axisLine: {
          lineStyle: {
            color: '#27b4c2'
          }
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      ],
      series: [{
        name: '充电用量数据',
        type: 'line',
        symbol: 'circle',
        symbolSize: 4,
        itemStyle: {
          normal: {
            color: '#fff',
            lineStyle: {
              color: '#3473FE',
              width: 2
            },
          }
        },
        label: {
          normal: {
            show: false,
            position: 'top'
          }
        },
        markPoint: {
          itemStyle: {
            normal: {
              color: '#fff'
            }
          }
        },
        data: dataList.map(item => item.charging_volume)
      }]
    };
  }

  /**
   * 生成所需数据
   */
  private generateData(): { yearSection: string, monthSection: string, dataList: Array<IMonthData> } {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const targetMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const targetYear = currentMonth === 12 ? currentYear : currentYear - 1;
    const yearSection = `${new Date(targetYear, targetMonth - 1).getTime() / 1000},${currentDate.getTime() / 1000}`;
    const monthSection = `${new Date(currentYear, currentMonth - 1).getTime() / 1000},${currentDate.getTime() / 1000}`;
    const dataList: Array<IMonthData> = [];
    for (let year = targetYear; year <= currentYear; year++) {
      const firstMonth = year === targetYear ? targetMonth : 1;
      const lastMonth = year === currentYear ? currentMonth : 12;
      for (let month = firstMonth; month <= lastMonth; month++) {
        dataList.push({
          month,
          year,
          charging_volume: 0
        });
      }
    }
    return {yearSection, monthSection, dataList};
  }
}
