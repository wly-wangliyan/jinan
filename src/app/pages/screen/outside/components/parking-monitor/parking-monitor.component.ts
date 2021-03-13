import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { OutsideHttpService, ParkingEntity, ParkingVideoEntity } from '../../outside-http.service';
import { ParkingMonitorVideoService } from './parking-monitor-video.service';

const MaxCount = 6;

@Component({
  selector: 'app-parking-monitor',
  templateUrl: './parking-monitor.component.html',
  styleUrls: ['./parking-monitor.component.less'],
  providers: [ParkingMonitorVideoService]
})
export class ParkingMonitorComponent implements OnInit {

  @ViewChild('parkingMonitorModal') private parkingMonitorModal: ElementRef;

  public labelList: Array<Array<ParkingVideoEntity>> = [];

  public selectLabelIndex = 0;

  public selectIndex = 0;

  public currentParking: ParkingEntity = new ParkingEntity();

  private token: string;

  public get isShowArrow(): boolean {
    return this.currentParking && this.currentParking.videos.length > MaxCount;
  }

  constructor(private renderder2: Renderer2,
    private outsideHttpService: OutsideHttpService,
    private monitorVideoService: ParkingMonitorVideoService) {
  }

  ngOnInit(): void {
  }

  public show(parking: ParkingEntity): void {
    this.selectLabelIndex = 0;
    this.selectIndex = 0;
    this.currentParking = parking;
    this.renderder2.setStyle(this.parkingMonitorModal.nativeElement, 'display', 'block');
    this.labelList = this.generateLabelList(this.currentParking.videos);
    const { app_key, app_secret } = this.currentParking;
    if (app_secret && app_key && this.currentParking.videos.length > 0) {
      this.outsideHttpService.requestMonitorToken(app_key, app_secret).subscribe(data => {
        this.token = data.body.token;
        if (this.token) {
          this.monitorVideoService.play(this.currentParking.videos[0].url, this.token, 1, 924, 518)
        }
      })
    }
  }

  public close(): void {
    this.renderder2.setStyle(this.parkingMonitorModal.nativeElement, 'display', 'none');
    this.monitorVideoService.stop().subscribe();
  }

  public onChangeArea(index: number): void {
    if (this.selectIndex === index + this.selectLabelIndex * MaxCount) {
      return;
    }
    this.selectIndex = index + this.selectLabelIndex * MaxCount;
    if (this.token) {
      this.monitorVideoService.play(this.labelList[this.selectLabelIndex][index].url, this.token, 1, 924, 518);
    }
  }

  //  -1 向前 1向后
  public onNextPage(status: number) {
    if (status === 1) {
      if (this.labelList[this.selectLabelIndex + 1]) {
        this.selectLabelIndex++;
      }
    } else {
      if (this.labelList[this.selectLabelIndex - 1]) {
        this.selectLabelIndex--;
      }
    }
  }

  private generateLabelList(dataList: Array<ParkingVideoEntity>) {
    const labelList = [];
    dataList.forEach((data, index) => {
      if (index % MaxCount === 0) {
        const tempList = [data];
        labelList.push(tempList);
      } else {
        const lastIndex = labelList.length - 1;
        labelList[lastIndex].push(data);
      }
    })
    return labelList;
  }
}
