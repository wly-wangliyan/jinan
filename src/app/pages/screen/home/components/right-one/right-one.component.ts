import {Component, OnDestroy, OnInit} from '@angular/core';
import {interval, Subscription} from 'rxjs';
import {HomeHttpService, ParkingDistrictCountEntity} from '../../home-http.service';
import districts from '../../map-districts';
import {REFRESH_DURATION, TimerService} from '../../../../../core/timer.service';

@Component({
  selector: 'app-right-one',
  templateUrl: './right-one.component.html',
  styleUrls: ['./right-one.component.less']
})
export class RightOneComponent implements OnInit, OnDestroy {

  option: any = {};
  public chartInstance: any;
  public dataList: Array<ParkingDistrictCountEntity> = [];
  private listIndex = 0;
  private timerSubscription: Subscription;
  private dataSubscription: Subscription;

  constructor(private httpService: HomeHttpService, private timerService: TimerService) {
  }

  public ngOnInit(): void {
    this.requestData();
    this.dataSubscription = this.timerService.intervalTime(REFRESH_DURATION).subscribe(() => {
      this.requestData();
    });
    this.loopScroll();
  }

  // 停止滚动
  public pauseLoopScroll() {
    this.timerSubscription && this.timerSubscription.unsubscribe();
  }

  // 滚动显示数据
  public loopScroll() {
    this.timerSubscription = interval(5000).subscribe(x => {
        this.generateOption(this.dataList.slice(this.listIndex, this.listIndex + 3));
        this.listIndex += 3;
        let len = this.dataList.length - this.listIndex;
        if (len < 3) {
          while (len--) {
            this.dataList.unshift(this.dataList.pop());
          }
          this.listIndex = 0;
        }
      }
    );
  }

  private requestData() {
    this.httpService.requestParkingDistrictCount().subscribe(datas => {
      districts.forEach(item => {
        if (datas.findIndex(data => data.district_name === item.NAME_CHN) < 0) {
          const newDistrict = new ParkingDistrictCountEntity();
          newDistrict.district_name = item.NAME_CHN;
          datas.push(newDistrict);
        }
      });
      this.dataList = datas;
      this.listIndex = 0;
      this.generateOption(this.dataList.slice(this.listIndex, this.listIndex + 3));
      this.listIndex += 3;
    }, err => {
      this.dataList = districts.map(dist => {
        const item = new ParkingDistrictCountEntity();
        item.district_name = dist.NAME_CHN;
        return item;
      });
      this.listIndex = 0;
      this.generateOption(this.dataList.slice(this.listIndex, this.listIndex + 3));
      this.listIndex += 3;
    });
  }

  public onChartInit(chartInstance: any) {
    this.chartInstance = chartInstance;
  }

  private generateOption(datas: Array<any>): any {
    const option = {
      textStyle: {
        fontFamily: 'Source Han Sans SC',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          'type': 'shadow',
        },
        confine: true,
      },
      grid: {
        width: 332,
        left: 63,
        bottom: 56,
      },
      color: ['#3473FE', '#5AD8A6'],
      legend: {
        textStyle: {
          color: 'white',
          fontSize: 14,
          fontWeight: 'normal',
        },
        itemGap: 10,
        left: 37,
        top: 0,
        itemWidth: 26,
        itemHeight: 14,
        borderRadius: 2
      },
      xAxis: {
        data: [datas[0].district_name, datas[1].district_name, datas[2].district_name],
        type: 'category',
        axisLabel: {
          textStyle: {
            color: '#BFE8FF',
            fontSize: 18,
            fontWeight: 'normal',
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
      yAxis: [
        {
          type: 'value',
          name: '车场数',
          show: false,
        },

      ],
      series: [
        {
          type: 'bar',
          barWidth: 32,
          name: '路内停车场',
          data: [datas[0].inside_number, datas[1].inside_number, datas[2].inside_number],
          yAxisIndex: 0,
          label: {
            show: true,
            position: 'top',
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: 'bold',
          },
          itemStyle: {
            barBorderRadius: [16, 16, 0, 0],
          },
        },
        {
          type: 'bar',
          barWidth: 32,
          name: '路外停车场',
          data: [datas[0].outside_number, datas[1].outside_number, datas[2].outside_number],
          yAxisIndex: 0,
          label: {
            show: true,
            position: 'top',
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: 'bold',
          },
          itemStyle: {
            barBorderRadius: [16, 16, 0, 0],
          },
        },
      ]
    };
    if (this.chartInstance) {
      this.chartInstance.setOption(option, false);
    } else {
      this.option = option;
    }
  }

  public ngOnDestroy() {
    this.timerSubscription && this.timerSubscription.unsubscribe();
    this.dataSubscription && this.dataSubscription.unsubscribe();
  }
}


