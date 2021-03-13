import { TimerService, REFRESH_DURATION } from '../../../../../core/timer.service';
import { HomeHttpService, ParkingDistrictCountEntity } from '../../home-http.service';
import { Component, Input, OnInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';

const BAR_WIDTH = 121;

interface IDistrict {
  name: string;
  adcode: number;
}

interface IDistrictTotalCount {
  totalParkingCount: number;
  totalBicycleCount: number;
  totalPoleCount: number;
}

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.less']
})
export class MapModalComponent implements OnInit {

  @Input() adCode = 0;

  private _district: IDistrict;
  @Input() set district(district: IDistrict) {
    if (district && this._district) {
      if (district.adcode !== this._district.adcode) {
        this._district = district;
        this.updateData();
      }
    } else {
      this._district = district;
      this.updateData();
    }
  }

  get district(): IDistrict {
    return this._district;
  }

  private _totalInfo: IDistrictTotalCount;
  @Input() set totalInfo(totalParkingCount: IDistrictTotalCount) {
    this._totalInfo = totalParkingCount;
    if (this._totalInfo) {
      this.updateData();
    }
  }

  get totalInfo(): IDistrictTotalCount {
    return this._totalInfo;
  }

  public insideWidth = 0;
  public insideNumber = 0;
  public outsideWidth = 0;
  public outsideNumber = 0;
  public bicycleWidth = 0;
  public bicycleNumber = 0;
  public powerWidth = 0;
  public powerNumber = 0;

  private dataSubscription: Subscription;
  private timerSubscription: Subscription;

  constructor(private homeHttpService: HomeHttpService, private timerService: TimerService) {
  }

  ngOnInit(): void {
  }

  updateData() {
    this.timerSubscription && this.timerSubscription.unsubscribe();
    this.dataSubscription && this.dataSubscription.unsubscribe();
    if (this.district) {
      this.timerSubscription = this.timerService.intervalTime(REFRESH_DURATION).subscribe(() => {
        this.requestAllData();
      });
      this.requestAllData();
    } else {
      // 没有选中区域
      this.insideWidth = 0;
      this.insideNumber = 0;
      this.outsideWidth = 0;
      this.outsideNumber = 0;
      this.bicycleWidth = 0;
      this.bicycleNumber = 0;
      this.powerWidth = 0;
      this.powerNumber = 0;
    }
  }

  requestAllData() {
    const httpList = [this.homeHttpService.requestParkingDistrictCount(this.district.adcode),
    this.homeHttpService.requestPowerPoleCount(this.district.adcode),
    this.homeHttpService.requestBicycleDistrictCount(this.district.adcode)];
    this.dataSubscription = forkJoin(httpList).subscribe((results: any[]) => {
      // 停车场
      if (results[0].length > 0 && this.totalInfo && this.totalInfo.totalParkingCount > 0) {
        this.insideWidth = results[0][0].inside_number / this.totalInfo.totalParkingCount * BAR_WIDTH;
        this.insideNumber = results[0][0].inside_number;
        this.outsideWidth = results[0][0].outside_number / this.totalInfo.totalParkingCount * BAR_WIDTH;
        this.outsideNumber = results[0][0].outside_number;
      } else {
        this.insideWidth = 0;
        this.insideNumber = 0;
        this.outsideWidth = 0;
        this.outsideNumber = 0;
      }
      // 充电桩
      if (results[1] && this.totalInfo && this.totalInfo.totalPoleCount > 0) {
        this.powerWidth = results[1].total_count / this.totalInfo.totalPoleCount * BAR_WIDTH;
        this.powerNumber = results[1].total_count;
      } else {
        this.powerWidth = 0;
        this.powerNumber = 0;
      }
      // 单车
      if (results[2] && this.totalInfo && this.totalInfo.totalBicycleCount > 0) {
        this.bicycleWidth = results[2].count / this.totalInfo.totalBicycleCount * BAR_WIDTH;
        this.bicycleNumber = results[2].count;
      } else {
        this.bicycleWidth = 0;
        this.bicycleNumber = 0;
      }
    });
  }
}
