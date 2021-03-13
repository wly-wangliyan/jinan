import { PowerHttpService, SubsidyCountsByOperatorEntity } from '../power-http.service';
import { TimerService, REFRESH_DURATION } from '../../../../core/timer.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import echarts from 'echarts';
import { forkJoin, Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-charging-allowance-number',
  templateUrl: './charging-allowance-number.component.html',
  styleUrls: ['./charging-allowance-number.component.less', '../power.component.less']
})
export class ChargingAllowanceNumberComponent implements OnInit, OnDestroy {

  public chartOptions: any;

  public totalData = '0';
  public todayData = '0';
  private listIndex = 0;

  public dataList: Array<SubsidyCountsByOperatorEntity> = [];

  // 获取今日零点时间戳
  private get CurrentZeroStamp() {
    return Math.round(new Date(new Date().toDateString()).getTime() / 1000);
  }

  private get CurrentLastStamp() {
    const t = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1;
    return Math.round(t / 1000);
  }


  private dataSubscription: Subscription;
  private timerSubscription: Subscription;

  constructor(
    private timerService: TimerService,
    private powerService: PowerHttpService
  ) {
  }

  ngOnInit(): void {
    this.requestData();
    this.timerSubscription = this.timerService.intervalTime(REFRESH_DURATION).subscribe(() => {
      this.requestData();
    });
    this.loopScroll();
  }

  // 滚动显示数据
  public loopScroll() {
    this.timerSubscription = interval(5000).subscribe(x => {
      if (this.dataList.length > 4) {
        this.generateCharts(this.dataList.slice(this.listIndex, this.listIndex + 5));
        this.listIndex += 5;
        let len = this.dataList.length - this.listIndex;
        if (len < 5) {
          while (len--) {
            this.dataList.unshift(this.dataList.pop());
          }
          this.listIndex = 0;
        }
      } else {
        this.pauseLoopScroll();
      }
    }
    );
  }

  // 停止滚动
  public pauseLoopScroll() {
    this.timerSubscription && this.timerSubscription.unsubscribe();
  }

  public requestData() {
    const section = `${this.CurrentZeroStamp},${this.CurrentLastStamp}`;

    const http = [this.powerService.requestSubsidyCountsByOperator(),
    this.powerService.requestChargingSubsidyCount(),
    this.powerService.requestChargingSubsidyCount(section)];

    this.dataSubscription = forkJoin(http).subscribe((results: any[]) => {
      this.dataList = results[0].results;
      this.totalData = results[1].body.count.toString();
      this.todayData = results[2].body.count.toString();

      this.listIndex = 0;
      this.generateCharts(this.dataList.slice(this.listIndex, this.listIndex + 5));
      this.listIndex += 5;
    });
  }

  private generateCharts(datas: Array<any>): void {
    const length = datas.length;
    let tmpCountData = [];
    let tmpOperatorName = [];
    if (length > 4) {
      tmpCountData = [datas[0].count, datas[1].count, datas[2].count, datas[3].count, datas[4].count];
      tmpOperatorName = [datas[0].operator_name,
      datas[1].operator_name,
      datas[2].operator_name, datas[3].operator_name, datas[4].operator_name];
    } else {
      datas.forEach(item => {
        tmpCountData.push(item.count);
        tmpOperatorName.push(item.operator_name);
      });
    }

    this.chartOptions = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}',
        confine: true,
        textStyle: {
          fontFamily: 'Source Han Sans SC',
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
          // offset: 5,
          type: 'category',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#1995DE'
            }
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#BFE8FF',
            fontSize: 14,
            interval: 0,
            fontFamily: 'Source Han Sans SC',
            fontWeight: 'normal',
            // rotate: 20
          },
          data: tmpOperatorName,
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
          // splitNumber: 3,
          minInterval: 1,
        }
      ],
      series: [
        {
          barWidth: 24,
          name: '充电补贴车次',
          type: 'bar',
          data: tmpCountData,

          color: new echarts.graphic.LinearGradient(
            0, 0, 0, 1,
            [
              { offset: 1, color: 'rgba(50, 255, 180, 0)' },
              { offset: 0, color: 'rgba(50, 255, 180, 1)' }
            ]
          ),
          label: {
            normal: {
              show: true,
              position: ['10', '-20'],
              fontWeight: 'bold',
              fontSize: 14,
              color: '#fff',
              align: 'center',
              fontFamily: 'Source Han Sans SC',
            }
          },
          barGap: '50%',
          itemStyle: {
            barBorderRadius: [12, 12, 0, 0],
          },
        },
      ]
    };
  }

  ngOnDestroy() {
    this.dataSubscription && this.dataSubscription.unsubscribe();
    this.timerSubscription && this.timerSubscription.unsubscribe();
  }

}
