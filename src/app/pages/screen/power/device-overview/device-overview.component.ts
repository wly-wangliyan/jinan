import { PowerHttpService, PoleCountsByStatusEntity } from '../power-http.service';
import { TimerService, REFRESH_DURATION } from '../../../../core/timer.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

interface PoleCountsInterface {
  totalNormalPoleCount: number;
  totalOffPoleCount: number;
  totalBrokePoleCount: number;
}
@Component({
  selector: 'app-device-overview',
  templateUrl: './device-overview.component.html',
  styleUrls: ['./device-overview.component.less', '../power.component.less']
})
export class DeviceOverviewComponent implements OnInit, OnDestroy {

  option = {};
  public dataList: Array<PoleCountsByStatusEntity> = [];

  private dataSubscription: Subscription;
  private timerSubscription: Subscription;

  constructor(
    private timerService: TimerService,
    private powerService: PowerHttpService
  ) {
    this.timerSubscription = this.timerService.intervalTime(REFRESH_DURATION).subscribe(() => {
      this.requestData();
    });
  }

  ngOnInit(): void {
    this.requestData();
  }

  private generateOption(): any {
    const data = this.processData(this.dataList);
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
        textStyle: {
          fontFamily: 'Source Han Sans SC',
        },
      },
      color: ['#32FFB4', '#0091FF', '#FF6F6F'],
      legend: {
        orient: 'vertical',
        top: 70,
        right: 20,
        data: ['正常', '离线', '故障'],
        textStyle: {
          color: '#BFE8FF',
          fontSize: 14,
          fontFamily: 'Source Han Sans SC',
          fontWeight: 'normal'
        },
        itemWidth: 14,
      },
      series: [
        {
          name: '设备状态',
          type: 'pie',
          radius: ['30%', '65%'],
          avoidLabelOverlap: true,
          roundCap: true,
          label: {
            show: true,
            formatter: (params: any) => {
              return params.percent + '%';
            },
            color: 'white',
            fontSize: '14',
            fontWeight: 'bold',
            margin: '5%',
            fontFamily: 'Source Han Sans SC',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '14',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true
          },
          data: [{ value: data.totalNormalPoleCount, name: '正常' },
          { value: data.totalOffPoleCount, name: '离线' },
          { value: data.totalBrokePoleCount, name: '故障' }]
        }
      ]
    };
  }

  processData(dataList: Array<PoleCountsByStatusEntity>) {
    const tmpData: PoleCountsInterface = {
      totalNormalPoleCount: 0,
      totalOffPoleCount: 0,
      totalBrokePoleCount: 0,
    };


    dataList.map(item => {
      if (item.equipment_status === 0) {
        tmpData.totalNormalPoleCount += item.count;
      }
      if (item.equipment_status === 1) {
        tmpData.totalOffPoleCount += item.count;
      }
      if (item.equipment_status === 2) {
        tmpData.totalBrokePoleCount += item.count;
      }
    });
    return tmpData;
  }

  requestData() {
    this.dataSubscription = this.powerService.requestPoleCountsByStatus().subscribe(res => {
      this.dataList = res.results;
      this.option = this.generateOption();
    });
  }

  ngOnDestroy() {
    this.dataSubscription && this.dataSubscription.unsubscribe();
    this.timerSubscription && this.timerSubscription.unsubscribe();
  }

}
