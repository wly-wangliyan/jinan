import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-hotline',
  templateUrl: './hotline.component.html',
  styleUrls: ['./hotline.component.less']
})
export class HotlineComponent implements OnInit {

  option: any = {};
  public total_num = '1252';
  public chartInstance: any;

  constructor() {
  }

  ngOnInit(): void {
    this.generateOption();
  }

  public onChartInit(chartInstance: any) {
    this.chartInstance = chartInstance;
  }

  private generateOption(): any {
    const option = {
      textStyle: {
        fontFamily: 'Source Han Sans SC',
      },
      color: ['#5AD8A6', '#3473FE'],
      grid: {
        width: 380,
        height: 150,
        left: 42,
        bottom: 48,
      },
      legend: {
        itemGap: 24,
        show: true,
        textStyle: {
          fontWeight: 'normal',
          color: 'white',
          fontSize: 14,
        },
        data: [{
          name: '服务满意度',
          itemStyle: {color: '#3473FE'},
        },
          {
            name: '处理结果满意度',
            color: '#3473FE',
          }],
        left: 248,
        top: 98,
        itemWidth: 26,
        itemHeight: 14,
        borderRadius: 2
      },
      xAxis: [
        {
          data: ['服务满意度', '处理结果满意度'],
          type: 'category',
          z: 10,
          axisLabel: {
            textStyle: {
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          axisLine: {
            lineStyle: {
              color: '#1995DE',
              width: 1,
            },
          },
          axisTick: {
            show: false,
          }
        },
      ],
      yAxis: [
        {
          type: 'value',
          show: false,
        }
      ],
      series: [
        this.seriesListA(1212, 1300, 'first', '服务满意度'),
        this.seriesListB(1212, 1300, 'first', '服务满意度'),
        this.seriesListA(1420, 1500, 'second', '服务满意度'),
        this.seriesListB(1420, 1500, 'second', '服务满意度'),
        this.seriesListA(1119, 1100, 'third', '处理结果满意度'),
        this.seriesListB(1119, 1100, 'third', '处理结果满意度'),
      ]
    };
    if (this.chartInstance) {
      this.chartInstance.setOption(option, false);
    } else {
      this.option = option;
    }
  }

  private seriesListA(data1: number, data2: number, stack: string, name: string) {
    const labelOption = {
      show: true,
      position: 'inside',
      formatter: (opt) => {
        const arr = ['8月', '9月', '10月'];
        if (opt.data === 0) {
          return '';
        }
        return `${arr[opt.seriesIndex / 2]}`;
      },
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 'bold',
    };
    const seriesData = {
      name: `${name}`,
      type: 'bar',
      barGap: '40%',
      stack: `${stack}`,
      label: labelOption,
      data: [
        {
          value: data1,
          itemStyle: {
            color: '#5AD8A6',
            barBorderRadius: [16, 16, 0, 0]
          },
        },
        {
          value: data2,
          itemStyle: {
            color: '#3473FE',
            barBorderRadius: [16, 16, 0, 0]
          }
        }
      ],
      barWidth: 38,
    };
    return seriesData;
  }

  private seriesListB(data1: number, data2: number, stack: string, name: string) {
    const labelOption = {
      show: true,
      position: 'insideBottom',
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 'bold',
    };
    const seriesData = {
      name: `${name}`,
      type: 'bar',
      barGap: '40%',
      stack: `${stack}`,
      label: labelOption,
      data: [data1, data2],
      barWidth: 38,
      itemStyle: {
        color: 'transparent',
        barBorderRadius: [16, 16, 0, 0],
      },
    };
    return seriesData;
  }
}
