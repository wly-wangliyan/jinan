import { Component, OnInit } from '@angular/core';
import { mockData } from '../../mock-data';

@Component({
  selector: 'app-left-three',
  templateUrl: './left-three.component.html',
  styleUrls: ['./left-three.component.less']
})
export class LeftThreeComponent implements OnInit {

  public chartOptions: any;

  public chartInstance: any;

  constructor() {
  }

  ngOnInit(): void {
    this.generateCharts();
  }

  public onChartInit(chartInstance: any): void {
    this.chartInstance = chartInstance;
  }

  private generateCharts(): void {

    this.chartOptions = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['进场数量', '出场数量'],
        icon: 'roundRect',
        right: 30,
        top: 20,
        textStyle: {
          color: '#BFE8FF',
          fontSize: 14
        },
        itemWidth: 10,
        itemHeight: 10
      },
      grid: {
        left: '3%',
        right: '8%',
        bottom: '5%',
        containLabel: true
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
        data: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
      },
      yAxis: [
        {
          type: 'value',
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
        }
      ],
      series: [
        {
          name: '进场数量',
          type: 'line',
          symbol: 'none',
          smooth: true,
          lineStyle: {
            opacity: 0
          },
          areaStyle: {
            color: '#42E0FC',
            opacity: 0.4
          },
          data: mockData.carPeakAnalysis.entrance
        },
        {
          name: '出场数量',
          type: 'line',
          symbol: 'none',
          smooth: true,
          lineStyle: {
            opacity: 0
          },
          areaStyle: {
            color: '#F7B500',
            opacity: 0.4
          },
          data: mockData.carPeakAnalysis.exit
        },
      ],
      color: ['#42E0FC', '#F7B500']
    };
    this.chartInstance && this.chartInstance.setOption(this.chartOptions, true);
  }
}
