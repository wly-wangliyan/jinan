import {PowerHttpService, SubsidyCarCountsByMonthEntity} from '../power-http.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import echarts from 'echarts';
import {REFRESH_DURATION, TimerService} from '../../../../core/timer.service';
import {forkJoin, Subscription} from 'rxjs';

interface IMonthData {
  month: number;
  year: number;
  count: number;
}

@Component({
  selector: 'app-charging-subsidy-vehicle',
  templateUrl: './charging-subsidy-vehicle.component.html',
  styleUrls: ['./charging-subsidy-vehicle.component.less', '../power.component.less']
})
export class ChargingSubsidyVehicleComponent implements OnInit, OnDestroy {

  public chartOptions: any;

  public dataList: Array<SubsidyCarCountsByMonthEntity> = [];

  private timerSubscription: Subscription;
  private dataSubscription: Subscription;

  constructor(
    private powerService: PowerHttpService, private timerService: TimerService
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
          count: 0
        });
      }
    }
    return {yearSection, monthSection, dataList};
  }


  private requestData() {
    const info = this.generateData();
    const httpList = [this.powerService.requestSubsidyCarCountsByMonth(info.yearSection),
      this.powerService.requestSubsidyCarCounts(info.monthSection)];

    this.dataSubscription = forkJoin(httpList).subscribe((results: any) => {
      const tmpDict = {};
      results[0].results.forEach((item: SubsidyCarCountsByMonthEntity) => {
        tmpDict[(new Date(item.time_point * 1000)).getMonth() + 1] = item.car_count;
      });
      info.dataList.forEach(data => {
        data.count = tmpDict[data.month] ? tmpDict[data.month] : 0;
      });
      info.dataList[11].count = results[1].body.count;
      this.generateCharts(info.dataList);
    });

  }

  private generateCharts(dataList: Array<IMonthData>): void {
    console.log(dataList);
    this.chartOptions = {
      tooltip: {
        trigger: 'axis',
        textStyle: {
          fontFamily: 'Source Han Sans SC',
        },
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          'type': 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        confine: true, // 是否将 tooltip 框限制在图表的区域内。
        formatter: (params: any) => {
          const item = dataList[params[0].dataIndex];
          return `${item.year}-${item.month} <br/> ${params[0].seriesName}: ${params[0].data}`;
        },
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
            fontSize: 12,
            fontFamily: 'Source Han Sans SC',
            fontWeight: 'normal',
          },
          data: dataList.map(item => item.month)
        }
      ],
      yAxis: [
        {
          type: 'value',
          show: false,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitNumber: 3,
          minInterval: 1,
        }
      ],
      series: [
        {
          barWidth: 8,
          name: '充电补充车辆',
          type: 'bar',
          data: dataList.map(item => item.count),
          itemStyle: {
            normal: {
              color:
                new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 1, color: 'rgba(52, 115, 254, 0)'},
                    {offset: 0, color: 'rgba(52, 115, 254, 1)'}
                  ]
                ),
              barBorderRadius: [30, 30, 0, 0],
            }
          },
          label: {
            normal: {
              show: true,
              position: ['4', '-20'],
              fontWeight: 'bold',
              fontSize: 14,
              color: '#fff',
              align: 'center',
              fontFamily: 'Source Han Sans SC',
            }
          }
        },
      ]
    };
  }

}
