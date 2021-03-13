import { CarCountsByTypesEntity, PowerHttpService, OperatorRanksEntity, StationVolumesEntity, CarCountsByManufacturerEntity } from '../power-http.service';
import { Component, ElementRef, OnInit, Renderer2, ViewChild, OnDestroy } from '@angular/core';
import { Subscription, Subject, timer, fromEvent } from 'rxjs';
import { PowerOverviewModalListenerService } from '../power-overview-modal-listener.service';

@Component({
  selector: 'app-overview-modal',
  templateUrl: './overview-modal.component.html',
  styleUrls: ['./overview-modal.component.less']
})
export class OverviewModalComponent implements OnInit, OnDestroy {

  public title = '';
  public dataList: Array<OperatorRanksEntity | StationVolumesEntity | CarCountsByTypesEntity | CarCountsByManufacturerEntity> = [];

  // 获取当前时间戳
  private get CurrentStamp() {
    return Math.round(new Date().getTime() / 1000);
  }
  // 获取当月零点时间戳
  private get CurrentMothStamp() {
    const data = new Date();
    data.setDate(1);
    data.setHours(0);
    data.setSeconds(0);
    data.setMinutes(0);
    return Math.round(data.getTime() / 1000);
  }
  @ViewChild('powerViewModal') private powerViewModalRef: ElementRef;

  private powerOverviewClickSubscription$: Subscription;

  private dataSubscription: Subscription;
  private timerSubscription: Subscription;

  private nextTerm$ = new Subject();

  constructor(
    private powerOverviewModalListenerService: PowerOverviewModalListenerService,
    private rederer2: Renderer2,
    private powerService: PowerHttpService
  ) { }

  ngOnInit(): void {
    this.powerOverviewClickSubscription$ && this.powerOverviewClickSubscription$.unsubscribe();
    this.powerOverviewClickSubscription$ = this.powerOverviewModalListenerService.powerOverviewModalClick$.subscribe((res: string) => {
      if (res === 'back') {
        this.rederer2.setStyle(this.powerViewModalRef.nativeElement, 'left', '-500px');

      } else {
        this.title = res;
        if (this.title == 'yunyingshang') {
          this.dataSubscription = this.nextTerm$.subscribe(() => {
            this.powerService.requestOperatorRanks().subscribe(res => {
              this.dataList = res.results;
              this.rederer2.setStyle(this.powerViewModalRef.nativeElement, 'left', '12px');
            });
          });
        }
        if (this.title == 'dianzhan') {
          const section = `${this.CurrentMothStamp},${this.CurrentStamp}`;
          this.dataSubscription = this.nextTerm$.subscribe(() => {
            this.powerService.requestStationVolumes(section).subscribe(res => {
              this.dataList = res.results;
              this.rederer2.setStyle(this.powerViewModalRef.nativeElement, 'left', '12px');
            });
          });
        }
        if (this.title == 'changjia') {
          this.dataSubscription = this.nextTerm$.subscribe(() => {
            this.powerService.requestCarCountsByManufacturer().subscribe(res => {
              this.dataList = res.results;
              this.rederer2.setStyle(this.powerViewModalRef.nativeElement, 'left', '12px');
            });
          });
        }
        if (this.title == 'leixing') {
          this.dataSubscription = this.nextTerm$.subscribe(() => {
            this.powerService.requestCarCountsByType().subscribe(res => {
              this.dataList = res.results;
              this.rederer2.setStyle(this.powerViewModalRef.nativeElement, 'left', '12px');
            });
          });
        }

        this.nextTerm$.next();
      }
    });

    const headerIcon = document.getElementById('backIcon');
    fromEvent(headerIcon, 'click').subscribe(() => {
      this.dataSubscription && this.dataSubscription.unsubscribe();
      this.powerOverviewModalListenerService.powerOverviewModalClick$.next('back');
    });
  }

  ngOnDestroy() {
    this.dataSubscription && this.dataSubscription.unsubscribe();
    this.timerSubscription && this.timerSubscription.unsubscribe();
  }

}
