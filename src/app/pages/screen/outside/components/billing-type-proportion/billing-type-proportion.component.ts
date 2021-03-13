import {REFRESH_DURATION} from '../../../../../core/timer.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {OutsideHttpService} from '../../outside-http.service';
import {TimerService} from '../../../../../core/timer.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-billing-type-proportion',
  templateUrl: './billing-type-proportion.component.html',
  styleUrls: ['./billing-type-proportion.component.less']
})
export class BillingTypeProportionComponent implements OnInit, OnDestroy {

  public chartOptions: any;

  public chartInstance: any;

  public dataList: Array<EchartItem> = [];

  private colorHelper = ['#32FFB4', '#0091FF', '#FF6F6F'];

  private timerSubscription: Subscription;

  constructor(private outsideHttpService: OutsideHttpService,
              private timerService: TimerService) {
    this.timerSubscription = this.timerService.intervalTime(REFRESH_DURATION).subscribe(() => {
      this.requestData();
    });
  }

  ngOnInit(): void {
    this.requestData();
  }

  public ngOnDestroy(): void {
    this.timerSubscription && this.timerSubscription.unsubscribe();
  }

  public requestData() {
    this.outsideHttpService.requestParkingChargeTypeInfo().subscribe(results => {
      const dataList = this.generateData();
      results.forEach(res => {
        const findData = dataList.find(data => data.charge_type === res.charge_type);
        if (findData) {
          findData.value = res.num;
        }
      });
      this.dataList = dataList;
      this.generateCharts();
    }, err => {

    });
  }

  public generateData(): Array<EchartItem> {
    const tempList = [];
    tempList.push(new EchartItem('政府定价', 1));
    tempList.push(new EchartItem('政府指导价', 2));
    tempList.push(new EchartItem('市场调节价', 3));
    return tempList;
  }

  public onChartInit(chartInstance: any): void {
    this.chartInstance = chartInstance;
  }

  private generateCharts(): void {
    this.chartOptions = {
      textStyle: {
        fontFamily: 'Source Han Sans SC',
      },
      legend: {
        bottom: 20,
        textStyle: {
          color: '#BFE8FF',
          fontWeight: 'normal',
        },
        data: this.dataList.map(item => item.name)
      },
      series: [
        {
          type: 'pie',
          radius: ['20%', '45%'],
          center: ['50%', '40%'],
          avoidLabelOverlap: true,
          label: {
            show: true,
            position: 'outside',
            color: '#fff',
            fontWeight: 'bold',
            formatter: '{d}%',
          },
          labelLine: {
            show: true,
            length: 10,
            length2: 10,
          },
          data: this.dataList
        }
      ],
      color: this.colorHelper
    };

    this.chartInstance && this.chartInstance.setOption(this.chartOptions, true);
  }

}

class EchartItem {
  public value = 0;
  public name: string = undefined;
  public charge_type: number = undefined;

  constructor(name: string, charge_type: number) {
    this.name = name;
    this.charge_type = charge_type;
  }
}
