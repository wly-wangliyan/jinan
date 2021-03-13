import { Component, OnInit } from '@angular/core';
import { mockData } from '../../mock-data';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-right-one',
  templateUrl: './right-one.component.html',
  styleUrls: ['./right-one.component.less']
})
export class RightOneComponent implements OnInit {

  public chartOptions: any;

  public chartInstance: any;

  public communitys = [];

  public selectCommunity = '';

  public totalCount = mockData.communityUtilizationRate.totalCount;

  public surplusCount = mockData.communityUtilizationRate.surplusCount;

  constructor() {
    this.communitys = mockData.communityUtilizationRate.rates.map(item => item.name).filter(item => !!item);
  }

  ngOnInit(): void {
    this.onCommunityChange();
  }

  public toString(value: any): string {
    if (isNullOrUndefined(value)) {
      return '';
    }
    return String(value);
  }

  public onChartInit(chartInstance: any): void {
    this.chartInstance = chartInstance;
  }

  public onCommunityChange(value = '') {
    const temp = mockData.communityUtilizationRate.rates.find(item => item.name === value);
    if (temp) {
      this.generateCharts(temp.data);
    }
  }

  private generateCharts(data: Array<number>): void {

    this.chartOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          'type': 'line' // 默认为直线，可选为：'line' | 'shadow'
        },
        confine: true, // 是否将 tooltip 框限制在图表的区域内。
        formatter: '{c}%',
      },
      grid: {
        bottom: 30,
        left: 30,
        top: 10,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#1995DE'
          }
        },
        axisLabel: {
          color: '#BFE8FF',
          fontSize: 14,
          interval: 0,
          fontWeight: 'normal'
        },
        axisTick: {
          show: false,
          alignWithLabel: true,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['rgba(25, 149, 222, 0.4)']
          }
        },
        data: ['0:00', '4:00', '8:00', '12:00', '16:00', '20:00'],
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(25, 149, 222, 0.4)',
          }
        },
        axisLabel: {
          color: '#32FFB4',
          fontWeight: 'bold',
          fontSize: 14,
        },
        axisTick: {
          show: false
        }
      },
      series: [
        {
          type: 'line',
          data,
          itemStyle: {
            barBorderRadius: [12, 12, 0, 0],
          },
          symbolSize: 6,
          lineStyle: {
            width: 3
          }
        },
      ],
      color: ['#3473FE']
    };
    this.chartInstance && this.chartInstance.setOption(this.chartOptions, true);
  }

}
