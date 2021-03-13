import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {REFRESH_DURATION, TimerService} from '../../../../../core/timer.service';

@Component({
  selector: 'app-complaint-types',
  templateUrl: './complaint-types.component.html',
  styleUrls: ['./complaint-types.component.less']
})
export class ComplaintTypesComponent implements OnInit, OnDestroy {

  public option: any = {};
  public chartInstance: any;
  public seriesList = [
    {type: '设备故障', number: '150', color: '#3473FE'},
    {type: '乱停车', number: '200', color: '#D934BC'},
    {type: '服务态度差', number: '300', color: '#FF6F6F'},
    {type: '停车位不足', number: '400', color: '#789EF1'},
    {type: '刮擦', number: '450', color: '#F7B500'},
    {type: '乱收费', number: '500', color: '#5AD8A6'}];

  private dataSubscription: Subscription;

  constructor(private timerService: TimerService) {
  }

  ngOnInit(): void {
    this.dataSubscription = this.timerService.intervalTime(REFRESH_DURATION).subscribe(() => {
      this.generateOption(this.seriesList);
    });
    this.generateOption(this.seriesList);
  }

  public ngOnDestroy() {
    this.dataSubscription && this.dataSubscription.unsubscribe();
  }

  public onChartInit(chartInstance: any) {
    this.chartInstance = chartInstance;
  }

  private generateOption(datas: Array<any>): any {
    const option = {
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow'
        },
        showContent: true,
        confine: true,
        triggerOn: 'mousemove',
      },
      angleAxis: {
        max: (value) => (value.max + 100),
        startAngle: 90,
        splitLine: {
          show: false
        },
        show: false
      },
      radiusAxis: {
        type: 'category',
        z: 10,
        show: false,
      },
      polar: {
        radius: 70,
        center: [160, 120],
      },
      series: datas.map(series => ({
        type: 'bar',
        data: [series.number],
        name: series.type,
        color: series.color,
        coordinateSystem: 'polar',
        roundCap: true,
        itemStyle: {
          borderWidth: 1
        }
      })),
      legend: {
        textStyle: {
          color: 'white',
          fontSize: 13,
          fontWeight: 'normal',
        },
        itemHeight: 14,
        itemWidth: 20,
        left: 290,
        top: 48,
        orient: 'vertical',
        show: true,
      }
    };
    if (this.chartInstance) {
      this.chartInstance.setOption(option, false);
    } else {
      this.option = option;
    }
  }

}
