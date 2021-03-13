import {Component, Input, OnInit} from '@angular/core';

interface ITotalData {
  totalPoleCount: number;
  totalPowerCarCount: number;
  totalNormalCarCount: number; // 非新能源车辆
}

@Component({
  selector: 'app-left-two',
  templateUrl: './left-two.component.html',
  styleUrls: ['./left-two.component.less']
})
export class LeftTwoComponent implements OnInit {

  private _totalInfo: ITotalData;
  @Input() set totalInfo(totalInfo: ITotalData) {
    this._totalInfo = totalInfo;
    if (this._totalInfo) {
      if (this.chartInstanceA) {
        this.chartInstanceA.setOption(this.generateOptionA(), false);
      } else {
        this.optionA = this.generateOptionA();
      }
      if (this.chartInstanceB) {
        this.chartInstanceB.setOption(this.generateOptionB(), false);
      } else {
        this.optionB = this.generateOptionB();
      }
    }
  }

  get totalInfo(): ITotalData {
    return this._totalInfo;
  }

  optionA: any = {};
  optionB: any = {};
  public chartInstanceA: any;
  public chartInstanceB: any;

  ngOnInit(): void {

  }

  public onChartInitA(chartInstance: any) {
    this.chartInstanceA = chartInstance;
  }

  public onChartInitB(chartInstance: any) {
    this.chartInstanceB = chartInstance;
  }

  private generateOptionA() {
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
        confine: true,
        textStyle: {
          fontFamily: 'Source Han Sans SC',
        },
      },
      color: ['#42E0FC', '#1995DE'],
      legend: {
        orient: 'vertical',
        bottom: 10,
        data: ['新能源车辆数', '充电桩数量'],
        textStyle: {
          color: '#BFE8FF',
          fontSize: 14,
          fontFamily: 'Source Han Sans SC',
        },
        itemWidth: 14,
      },
      series: [
        {
          name: '说明',
          type: 'pie',
          radius: ['25%', '40%'],
          avoidLabelOverlap: true,
          label: {
            show: true,
            formatter: (params: any) => {
              return params.percent + '%';
            },
            color: 'white',
            fontSize: '12',
            fontWeight: 'bold',
            fontFamily: 'Source Han Sans SC',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '14',
              fontWeight: 'bold',
              fontFamily: 'Source Han Sans SC',
            }
          },
          labelLine: {
            show: true,
            length: 10,
            length2: 10,
          },
          data: [
            {value: this.totalInfo.totalPowerCarCount, name: '新能源车辆数'},
            {value: this.totalInfo.totalPoleCount, name: '充电桩数量'}
          ],
          hoverOffset: 5,
        }
      ]
    };
  }

  private generateOptionB(): any {
    return {
      textStyle: {
        fontFamily: 'Source Han Sans SC',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
        confine: true,
      },
      color: ['#FF944D', '#B620E0'],
      legend: {
        orient: 'vertical',
        bottom: 10,
        data: ['非新能源车辆数', '新能源车辆数'],
        textStyle: {
          color: '#BFE8FF',
          fontSize: 14,
          fontWeight: 'normal',
        },
        itemWidth: 14,
      },
      series: [
        {
          name: '说明',
          type: 'pie',
          radius: ['25%', '40%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            formatter: (params: any) => {
              return params.percent + '%';
            },
            color: 'white',
            fontSize: '12',
            fontWeight: 'bold',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '14',
              fontWeight: 'bold',
            }
          },
          labelLine: {
            show: true,
            length: 10,
            length2: 10,
          },
          data: [
            {value: this.totalInfo.totalNormalCarCount, name: '非新能源车辆数'},
            {value: this.totalInfo.totalPowerCarCount, name: '新能源车辆数'}
          ],
          hoverOffset: 5,
        }
      ]
    };
  }
}
