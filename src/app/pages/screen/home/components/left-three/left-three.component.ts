import {Subscription} from 'rxjs';
import {TimerService} from '../../../../../core/timer.service';
import {HomeHttpService} from '../../home-http.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {BicycleRatioEntity} from '../../home-http.service';

class IData {
  user_count: number;
  put_in_count: number;
  name: string;
}

@Component({
  selector: 'app-left-three',
  templateUrl: './left-three.component.html',
  styleUrls: ['./left-three.component.less']
})
export class LeftThreeComponent implements OnInit, OnDestroy {

  private bicycleRatioList: Array<BicycleRatioEntity> = [];

  option = {};

  private dataSubscription: Subscription;
  private timerSubscription: Subscription;

  constructor(private homeHttpService: HomeHttpService, private timerService: TimerService) {
    this.timerSubscription = timerService.intervalTime(10 * 60 * 1000).subscribe(() => {
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

  private generateOption(): any {
    const dataList = this.processData();
    return {
      textStyle: {
        fontFamily: 'Source Han Sans SC',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
      },
      color: ['#0091FF', '#8052FF'],
      legend: {
        right: 22,
        top: 27,
        data: ['单车注册量', '单车数量'],
        textStyle: {
          color: '#FFFFFF',
          fontSize: 14,
          fontWeight: 'normal',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        show: false,
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        data: dataList.map(data => data.name),
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#1995DE'
          }
        },
        axisLabel: {
          color: '#32FFB4',
          fontSize: 16,
          fontWeight: 'bold',
        }
      },
      series: [
        {
          name: '单车注册量',
          type: 'bar',
          data: dataList.map(data => data.put_in_count),
          barWidth: 14,
          itemStyle: {
            barBorderRadius: [0, 7, 7, 0],
          },
        },
        {
          name: '单车数量',
          type: 'bar',
          data: dataList.map(data => data.user_count),
          barWidth: 14,
          itemStyle: {
            barBorderRadius: [0, 7, 7, 0],
          },
        }
      ]
    };
  }

  private processData(): Array<IData> {
    const dataList = [];
    let company = this.bicycleRatioList.find(item => item.company_type === 1);
    if (company) {
      dataList.push({name: '青桔单车', user_count: company.user_count, put_in_count: company.put_in_count});
    } else {
      dataList.push({name: '青桔单车', user_count: 0, put_in_count: 0});
    }
    company = this.bicycleRatioList.find(item => item.company_type === 3);
    if (company) {
      dataList.push({name: '美团单车', user_count: company.user_count, put_in_count: company.put_in_count});
    } else {
      dataList.push({name: '美团单车', user_count: 0, put_in_count: 0});
    }
    company = this.bicycleRatioList.find(item => item.company_type === 2);
    if (company) {
      dataList.push({name: '哈罗单车', user_count: company.user_count, put_in_count: company.put_in_count});
    } else {
      dataList.push({name: '哈罗单车', user_count: 0, put_in_count: 0});
    }
    return dataList;
  }

  private requestData() {
    this.dataSubscription = this.homeHttpService.requestBicycleRatioData().subscribe(results => {
      this.bicycleRatioList = results;
      this.option = this.generateOption();
    });
  }
}
