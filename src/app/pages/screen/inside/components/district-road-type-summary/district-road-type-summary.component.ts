import { REFRESH_DURATION } from '../../../../../core/timer.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import echarts from 'echarts';
import { DistrictRoadTypeEntity, InsideHttpService } from '../../inside-http.service';
import districts from '../../../home/map-districts';
import { interval, Subscription } from 'rxjs';
import { TimerService } from '../../../../../core/timer.service';

@Component({
  selector: 'app-district-road-type-summary',
  templateUrl: './district-road-type-summary.component.html',
  styleUrls: ['./district-road-type-summary.component.less']
})
export class DistrictRoadTypeSummaryComponent implements OnInit, OnDestroy {

  public chartOptions: any;

  public chartInstance: any;

  public colorHelper = ['#81FF5D', '#FF6F6F', '#F7B500', '#3473FE'];

  public sourceDataList: Array<Array<DistrictRoadTypeEntity>> = []; // 原始数据

  public dataList: Array<Array<DistrictRoadTypeEntity>> = []; // 展示的数据

  private currentIndex = 0;

  private intervalSubscription: Subscription;

  private timerSubscription: Subscription;

  constructor(private insideHttpService: InsideHttpService,
              private timerService: TimerService) {
    this.timerSubscription = this.timerService.intervalTime(REFRESH_DURATION).subscribe(() => {
      this.requestData();
    });
  }

  ngOnInit(): void {
    this.requestData();
  }

  public ngOnDestroy(): void {
    this.intervalSubscription && this.intervalSubscription.unsubscribe();
    this.timerSubscription && this.timerSubscription.unsubscribe();
  }

  public requestData(): void {
    this.insideHttpService.requestDistrictRoadTypeInfo().subscribe(results => {
      const dataList = this.generateDataList();
      results.forEach(res => {
        const index = districts.findIndex(district => district.adcode.toString() === res.code);
        if (index > -1) {
          const findData = dataList[index].find(data => data.road_type === res.road_type);
          if (findData) {
            findData.num = res.num;
          }
        }
      });
      this.sourceDataList = dataList;
      this.intervalSubscription && this.intervalSubscription.unsubscribe();
      this.processData(0);
      this.intervalSubscription = interval(5000).subscribe(next => {
        this.processData(next + 1);
      });
    }, err => {

    });
  }

  // 截取四个数据
  public processData(index: number) {
    this.currentIndex = index;
    const realIndex = index % 3 * 4;
    this.dataList = this.sourceDataList.slice(realIndex, realIndex + 4);
    this.generateCharts();
  }

  // 初始化数据
  public generateDataList(): Array<DistrictRoadTypeEntity[]> {
    return districts.map(district => {
      return Array.from({length: 4})
        .map((v, k) => new DistrictRoadTypeEntity(district.NAME_CHN, district.adcode.toString(), k + 1));
    });
  }

  public onChartInit(chartInstance: any): void {
    this.chartInstance = chartInstance;
  }

  public onChartMouseLeave() {
    this.processData(this.currentIndex + 1);
    this.intervalSubscription = interval(5000).subscribe(next => {
      this.processData(this.currentIndex + 1);
    });
  }

  public onChartMouseEnter() {
    this.intervalSubscription && this.intervalSubscription.unsubscribe();
  }

  private generateCharts(): void {
    const xAxisData = this.dataList.map(data => data[0].district);
    const seriesData = Array.from({length: 4}).map((item, index) => this.dataList.map(data => data[index].num));

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
        formatter: (params) => {
          let message = params[0].name;
          params.forEach((item, index) => {
            message += `<br/><i style="display: inline-block;width:10px;height:10px;border-radius:5px;background:${this.colorHelper[index]}"></i> ${item.seriesName}：${item.value}`;
          });
          return message;
        },
        textStyle: {
          fontWeight: 'normal',
        },
      },
      grid: {
        bottom: 20,
        left: 30,
        top: 30,
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
            fontWeight: 'normal'
          },
          data: xAxisData,
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
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                {offset: 1, color: 'rgba(129, 255, 93, 0)'},
                {offset: 0, color: 'rgba(129, 255, 93, 1)'}
              ]
            ),
            barBorderRadius: 4,
          },
          barWidth: 8,
          name: '准停',
          type: 'bar',
          data: seriesData[0],
        },
        {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                {offset: 1, color: 'rgba(255, 111, 111, 0)'},
                {offset: 0, color: 'rgba(255, 111, 111, 1)'}
              ]
            ),
            barBorderRadius: 4,
          },
          barWidth: 8,
          name: '禁停',
          type: 'bar',
          data: seriesData[1],
        },

        {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                {offset: 1, color: 'rgba(247, 181, 0, 0)'},
                {offset: 0, color: 'rgba(247, 181, 0, 1)'}
              ]
            ),
            barBorderRadius: 4,
          },
          barWidth: 8,
          barGap: 0,
          name: '限停',
          type: 'bar',
          data: seriesData[2],
        },
        {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                {offset: 1, color: 'rgba(52, 115, 254, 0)'},
                {offset: 0, color: 'rgba(52, 115, 254, 1)'}
              ]
            ),
            barBorderRadius: 4,
          },
          barWidth: 8,
          barGap: 0,
          name: '临停',
          type: 'bar',
          data: seriesData[3],
        },
      ]
    };
    this.chartInstance && this.chartInstance.setOption(this.chartOptions, true);
  }

}
