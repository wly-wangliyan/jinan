import { REFRESH_DURATION } from '../../../../core/timer.service';
import { Component, ElementRef, OnInit, Renderer2, ViewChild, OnDestroy } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { TimerService } from '../../../../core/timer.service';
import { PowerOverviewModalListenerService } from '../power-overview-modal-listener.service';
import echarts from 'echarts';
import { PoleCountByChargingEntity, PoleCountsByTypeEntity, PowerHttpService } from '../power-http.service';
interface TypeDataInterface {
  totalCount: number;
  publicCount: number;
}

@Component({
  selector: 'app-charging-pile',
  templateUrl: './charging-pile.component.html',
  styleUrls: ['./charging-pile.component.less', '../power.component.less']
})
export class ChargingPileComponent implements OnInit, OnDestroy {

  optionA = {};
  optionB = {};

  public typeDataList: Array<PoleCountsByTypeEntity> = [];
  public statusData = new PoleCountByChargingEntity();

  private powerOverviewClickSubscription$: Subscription;
  private dataSubscription: Subscription;
  private timerSubscription: Subscription;

  @ViewChild('chargingPileRef') public chargingPileRef: ElementRef;
  constructor(
    private powerOverviewModalListenerService: PowerOverviewModalListenerService,
    private renderer2: Renderer2,
    private timerService: TimerService,
    private powerService: PowerHttpService
  ) {

    this.timerSubscription = this.timerService.intervalTime(REFRESH_DURATION).subscribe(() => {
      this.requestAll();
    });
  }

  ngOnInit(): void {
    this.powerOverviewClickSubscription$ && this.powerOverviewClickSubscription$.unsubscribe();
    this.powerOverviewClickSubscription$ = this.powerOverviewModalListenerService.powerOverviewModalClick$.subscribe((res) => {
      if (res === 'back') {
        this.renderer2.setStyle(this.chargingPileRef.nativeElement, 'left', '12px');
      } else {
        this.renderer2.setStyle(this.chargingPileRef.nativeElement, 'left', '-500px');
      }
    });

    this.requestAll();
  }

  requestAll() {
    const httpList = [this.powerService.requestPoleCountsByType(), this.powerService.requestPoleCountByCharging()];
    this.dataSubscription = forkJoin(httpList).subscribe((results: any[]) => {
      this.typeDataList = results[0].results;
      this.statusData = results[1];
      this.optionA = this.generateOptionA();
      this.optionB = this.generateOptionB();
    });
  }

  private processTypeData(): TypeDataInterface {
    const tmpData: TypeDataInterface = {
      publicCount: 0,
      totalCount: 0
    };
    this.typeDataList.filter(item => item.pole_type === 1).map(item => {
      tmpData.publicCount += item.count;
    });

    this.typeDataList.map(item => {
      tmpData.totalCount += item.count;
    });
    return tmpData;
  }

  private generateOptionA(): any {
    const data = this.processTypeData();
    const percent = data.totalCount === 0 ? '0%' : (data.publicCount * 100 / data.totalCount).toFixed(2) + '%';
    const colorA = '#1995DE';
    const colorB = '#42E0FC';
    const nameA = '公共桩';
    const nameB = '全部桩';
    return {
      color: [colorA, colorB],
      title: [{
        text: `{val|${percent}}\n{name|${nameA}}`,
        top: 'center',
        left: 'center',
        textStyle: {
          rich: {
            name: {
              fontSize: 14,
              fontWeight: 'normal',
              color: 'white',
              fontFamily: 'Source Han Sans SC',
              'text-align': 'center',
              padding: [5, 0]
            },
            val: {
              fontSize: 14,
              fontWeight: 'bold',
              fontFamily: 'Source Han Sans SC',
              color: 'white',
              'text-align': 'center',
            }
          }
        }
      }],
      legend: {
        orient: 'vertical',
        bottom: 10,
        data: [nameA, nameB],
        textStyle: {
          color: '#BFE8FF',
          fontSize: 14,
          fontFamily: 'Source Han Sans SC',
          fontWeight: 'normal',
        },
        itemWidth: 14,
        selectedMode: false
      },
      series: [
        {
          name: '说明',
          type: 'pie',
          radius: ['35%', '55%'],
          avoidLabelOverlap: true,
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: false,
            }
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: data.publicCount, name: nameA },
            {
              value: (data.totalCount - data.publicCount), name: nameB,
              itemStyle: {
                normal: { color: colorB },
                emphasis: { color: colorB },
              }
            }
          ],
          hoverOffset: 0,
        }
      ]
    };
  }

  private generateOptionB(): any {
    const percent = this.statusData.total_count === 0 ? '0%' :
      (this.statusData.charging_count * 100 / this.statusData.total_count).toFixed(2) + '%';
    const colorA = '#FF944D';
    const colorB = '#B620E0';
    const nameA = '充电中的充电桩';
    const nameB = '总充电桩';
    return {
      color: [colorA, colorB],
      title: [{
        text: `{val|${percent}}\n{name|充电中}`,
        top: 'center',
        left: 'center',
        textStyle: {
          rich: {
            name: {
              fontSize: 14,
              fontWeight: 'normal',
              color: 'white',
              'text-align': 'center',
              fontFamily: 'Source Han Sans SC',
              padding: [5, 0]
            },
            val: {
              fontSize: 14,
              fontWeight: 'bold',
              color: 'white',
              'text-align': 'center',
              fontFamily: 'Source Han Sans SC',
            }
          }
        }
      }],
      legend: {
        orient: 'vertical',
        bottom: 10,
        data: [nameA, nameB],
        textStyle: {
          color: '#BFE8FF',
          fontSize: 14,
          fontFamily: 'Source Han Sans SC',
          fontWeight: 'normal'
        },
        itemWidth: 14,
        selectedMode: false
      },
      series: [
        {
          name: '说明',
          type: 'pie',
          radius: ['35%', '55%'],
          avoidLabelOverlap: true,
          label: {
            show: false,
            color: 'white',
            fontSize: '12',
            fontWeight: 'bold',
            position: 'center',
          },
          emphasis: {
            label: {
              show: false,
              fontSize: '14',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false,
            length: 10,
            length2: 10,
          },
          data: [
            { value: this.statusData.charging_count, name: nameA },
            {
              value: (this.statusData.total_count - this.statusData.charging_count), name: nameB,
              itemStyle: {
                normal: { color: colorB },
                emphasis: { color: colorB },
              }
            }
          ],
          hoverOffset: 0,
        }
      ]
    };
  }

  ngOnDestroy() {
    this.dataSubscription && this.dataSubscription.unsubscribe();
    this.timerSubscription && this.timerSubscription.unsubscribe();
  }

}
