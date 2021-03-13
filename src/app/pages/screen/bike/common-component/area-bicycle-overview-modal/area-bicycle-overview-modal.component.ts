import {BikeHttpService} from '../../bike-http.service';
import {Component, ElementRef, EventEmitter, OnInit, Renderer2, ViewChild, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {BicycleAreaNumListenerService} from '../../bicycle-area-num-listener.service';

@Component({
  selector: 'app-area-bicycle-overview-modal',
  templateUrl: './area-bicycle-overview-modal.component.html',
  styleUrls: ['./area-bicycle-overview-modal.component.less']
})
export class AreaBicycleOverviewModalComponent implements OnInit {

  public regionLabelName = '';
  public arealist = [];
  // @Output()
  // onSendMessage = new EventEmitter();

  @ViewChild('areaBicycleOverviewModal') private areaBicycleOverviewRef: ElementRef;
  @ViewChild('model') private model: ElementRef;

  private areaBicycleNumDivClickSubscription$: Subscription;

  constructor(
    private bicycleAreaNumListenerSerivice: BicycleAreaNumListenerService,
    private rederer2: Renderer2,
    private service: BikeHttpService
  ) {
  }

  ngOnInit(): void {
    this.areaBicycleNumDivClickSubscription$ && this.areaBicycleNumDivClickSubscription$.unsubscribe();
    this.areaBicycleNumDivClickSubscription$ = this.bicycleAreaNumListenerSerivice.areaBicycleNumDivClick$.subscribe((res) => {
      if (res === 'back') {
        this.rederer2.setStyle(this.areaBicycleOverviewRef.nativeElement, 'left', '-500px');
      } else {
        this.regionLabelName = res.name;
        this.service.requestRegionLabelList(res.id).subscribe(data => {
          this.arealist = data.results;
          this.rederer2.setStyle(this.areaBicycleOverviewRef.nativeElement, 'left', '12px');
        });
      }
    });
  }

  public onBackClick() {
    this.bicycleAreaNumListenerSerivice.areaBicycleNumDivClick$.next('back');
  }

  // 点击列表项查看对应区域图层信息
  // public chooseItem(e, area) {
  //   const trs: any = document.querySelectorAll('.modal-content-common > tr');
  //   trs.forEach((item) => {
  //     item.childNodes.forEach((i) => {
  //       i.style.color = '#bce4fc';
  //     });
  //     item.style.backgroundColor = 'transparent';
  //   });
  //   e.target.childNodes.forEach((i) => {
  //     i.style.color = '#1FB3FF';
  //   });
  //   e.target.style.backgroundColor = 'rgba(31,179,255, .1)';
  //   this.onSendMessage.emit(area);
  // }
}
