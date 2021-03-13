import {REFRESH_DURATION} from '../../../../../core/timer.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {InsideHttpService} from '../../inside-http.service';
import {TimerService} from '../../../../../core/timer.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-parking-hour-and-arrears-rate',
  templateUrl: './parking-hour-and-arrears-rate.component.html',
  styleUrls: ['./parking-hour-and-arrears-rate.component.less']
})
export class ParkingHourAndArrearsRateComponent implements OnInit, OnDestroy {

  public chartOptions: any;

  public chartInstance: any;

  public dataList: Array<EchartItem> = [];

  private currentIndex = 0; // 当前tab 0： 停车时长 1：欠费率

  private colorHelper = {
    0: ['#42E0FC', '#A4E5FF', '#4E7CD9', '#4EBA92', '#0091FF', '#81FF5D'],
    1: ['#4153C8', '#CC4BB6', '#E95F70', '#5289C9', '#CCB33A']
  };

  private timerSubscription: Subscription;

  constructor(private insideHttpService: InsideHttpService,
              private timerService: TimerService) {
    this.timerSubscription = this.timerService.intervalTime(REFRESH_DURATION).subscribe(() => {
      this.onNameChange(this.currentIndex);
    });
  }

  ngOnInit(): void {
    this.onNameChange(this.currentIndex);
  }

  public ngOnDestroy(): void {
    this.timerSubscription && this.timerSubscription.unsubscribe();
  }

  public onChartInit(chartInstance: any): void {
    this.chartInstance = chartInstance;
  }

  public onNameChange(index: number): void {
    this.currentIndex = index;
    switch (index) {
      case 0:
        this.requestParkingHourData();
        break;
      case 1:
        this.requestArrearsRateData();
        break;
    }
  }

  // 请求停车时长数据
  private requestParkingHourData(): void {
    this.insideHttpService.requestParkingTimeStatisticInfo().subscribe(result => {
      const dataList = this.generateData(0);
      dataList.forEach(data => {
        data.value = result[data.asName];
      });
      this.dataList = dataList;
      this.generateCharts(0);
    }, err => {

    });

  }

  // 请求欠费率数据
  private requestArrearsRateData(): void {
    this.insideHttpService.requestArrearageStatisticInfo().subscribe(result => {
      const dataList = this.generateData(1);
      dataList.forEach(data => {
        data.value = result[data.asName];
      });
      this.dataList = dataList;
      this.generateCharts(1);
    }, err => {

    });
  }

  private generateCharts(index: number): void {
    const isShowLabel = index === 1 ? false : true;
    this.chartOptions = {
      textStyle: {
        fontFamily: 'Source Han Sans SC',
      },
      tooltip: {
        trigger: 'item',
        formatter: `{b}<br/> {c}${index === 1 ? '辆' : ''} ({d}%)`,
      },
      legend: {
        orient: 'vertical',
        right: 40,
        top: 40,
        textStyle: {
          color: '#fff',
          fontWeight: 'normal'
        },
        data: this.dataList.map(data => data.name)
      },
      series: [
        {
          type: 'pie',
          radius: ['30%', '60%'],
          center: ['35%', '50%'],
          avoidLabelOverlap: true,
          label: {
            show: isShowLabel,
            position: 'outside',
            color: '#fff',
            fontWeight: 'bold',
            formatter: '{d}%'
          },
          labelLine: {
            show: true,
            length: 10,
            length2: 10,
          },
          data: this.dataList
        }
      ],
      color: this.colorHelper[index]
    };

    this.chartInstance && this.chartInstance.setOption(this.chartOptions, true);
  }

  private generateData(index: number): Array<EchartItem> {
    const tempList = [];
    switch (index) {
      case 0:
        tempList.push(new EchartItem('2小时以下', 'under_two'));
        tempList.push(new EchartItem('2-4小时', 'two_four'));
        tempList.push(new EchartItem('4-6小时', 'four_six'));
        tempList.push(new EchartItem('6-8小时', 'six_eight'));
        tempList.push(new EchartItem('8-10小时', 'eight_ten'));
        tempList.push(new EchartItem('10小时以上', 'over_ten'));
        break;
      case 1:
        tempList.push(new EchartItem('100元以下', 'under_one'));
        tempList.push(new EchartItem('100-200元', 'one_two'));
        tempList.push(new EchartItem('200-500元', 'two_five'));
        tempList.push(new EchartItem('500-1000元', 'five_ten'));
        tempList.push(new EchartItem('1000元以上', 'over_ten'));
        break;
    }
    return tempList;
  }
}

class EchartItem {
  public name: string = undefined;
  public asName: string = undefined;
  public value = 0;

  constructor(name: string, asName: string) {
    this.name = name;
    this.asName = asName;
  }
}
