import {Component, Input, OnDestroy, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {EChartHelper} from '../../../../../../utils/echart-helper';

@Component({
  selector: 'app-full-bicycle-bar',
  templateUrl: './full-bicycle-bar.component.html',
  styleUrls: ['./full-bicycle-bar.component.less']
})
export class FullBicycleBarComponent implements OnDestroy {
  @Input() public sourceWidth: string;
  @Input() public sourceHeight: string;
  @Input() public sourceSize: 'lg' | 'sm' | 'superlg' = 'superlg';
  @Input() public subtext = '';
  @Input() public tooltipTitle = '数据';
  @Input() public xAxisName = '';
  @Input() public xAxisData: Array<any> = [];
  private _seriesList: Array<any>;
  @Input()
  public set seriesList(seriesList: Array<any>) {
    this._seriesList = seriesList;
    if (seriesList) {
      if (this.chartInstance) {
        this.chartInstance.setOption(this.generateOption(), false);
      } else {
        this.chartOptions = this.generateOption();
      }
    }
  }

  public get seriesList(): Array<any> {
    return this._seriesList;
  }

  public chartOptions: any = {};
  public chartInstance: any;

  private searchSubscription: Subscription;
  private dataSubscription: Subscription;

  @ViewChild('chartElement') private chartElement: any;

  constructor() {
  }

  public ngOnDestroy() {
    this.searchSubscription && this.searchSubscription.unsubscribe();
    this.dataSubscription && this.dataSubscription.unsubscribe();
  }

  public onChartInit(chartInstance: any) {
    this.chartInstance = chartInstance;
  }

  private generateOption(): any {
    const multiple = this.sourceSize === 'superlg' ? 2 : 1;
    return {
      textStyle: {
        fontFamily: 'Source Han Sans SC',
      },
      title: {
        subtext: this.subtext,
        subtextStyle: {
          color: '#00FFD6',
          fontSize: 14,
          fontFamily: 'Source Han Sans SC',
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        confine: true, // 是否将 tooltip 框限制在图表的区域内。
        formatter: (params, ticket, callback) => {
          let message = this.xAxisName === '日期' ? params[0].axisValue + '日' : (params[0].axisValue - 2) + '~' + params[0].axisValue + '时';
          for (const param of params) {
            message += '<br/>' + param.seriesName + this.tooltipTitle + ' : ' +
              param.data + EChartHelper.FormatTootipUnit(param.data, this.subtext);
          }
          return message;
        },
      },
      grid: {
        bottom: 20,
        left: 15,
        containLabel: true,
      },
      legend: {
        textStyle: {
          color: '#C8EBFF',
          fontSize: 14,
          fontWeight: 'normal',
        },
        data: this.seriesList.map(item => item.name),
        right: 10,
        top: 10 / multiple,
        itemHeight: 8 * multiple,
        itemGap: 20
      },
      calculable: true,
      xAxis: [
        {
          name: this.xAxisName,
          nameTextStyle: {
            color: '#00FFD6',
            fontSize: 14,
            fontWeight: 'bold',
            // padding: [-5, -5]
          },
          type: 'category',
          axisLabel: {
            fontSize: 16,
            // fontFamily: 'Source Han Sans SC',
            fontWeight: 'normal',
            color: '#BFE8FF',
            interval: 0,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#3969F3',
              width: 1
            }
          },
          axisTick: {
            show: false,
            alignWithLabel: true,
            interval: 0
          },
          splitLine: {
            show: false
          },
          // boundaryGap: ['8%', '8%'],
          data: this.xAxisData
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            color: '#32FFB4',
            fontWeight: 'bold',
            fontSize: 14,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
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
      series: this.seriesList.map(series => ({
        ...series,
        data: series.list.chartY,
        type: 'bar',
        barWidth: 8,
        itemStyle: {
          color: series.color,
          barBorderRadius: [30, 30, 0, 0],
        }
      })),
    };
  }
}
