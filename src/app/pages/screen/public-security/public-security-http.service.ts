import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mockData } from './mock-data';
import { delay } from 'rxjs/operators';
import { EntityBase } from '../../../../utils/z-entity';

@Injectable({
  providedIn: 'root'
})
export class PublicSecurityHttpService {

  constructor() {
  }

  // 社区接入排行榜
  public requestCommunityAccessRankingList(): Observable<Array<NormalEntity>> {
    const list = mockData.communityAccessRankingList.map(item => NormalEntity.Create(item));
    return of(list).pipe(delay(300));
  }

  // 周边停车资源分析
  public requestParkingSourceAnalysis(): Observable<Array<ParkingSourceAnalysisEntity>> {
    const list = mockData.parkingSourceAnalysis.map(item => ParkingSourceAnalysisEntity.Create(item));
    return of(list).pipe(delay(600));
  }

  // 共享车位数列表
  public requestShareSpotCountList(): Observable<Array<NormalEntity>> {
    const list = mockData.shareSpotCountList.map(item => NormalEntity.Create(item));
    return of(list).pipe(delay(500));
  }

  // 车辆进出场列表
  public requestVehicleAccessList(): Observable<Array<VehicleAccessEntity>> {
    const list = mockData.vehicleAccessList.map(item => VehicleAccessEntity.Create(item));
    return of(list).pipe(delay(400));
  }

}

export class NormalEntity extends EntityBase {
  public name: string = undefined;
  public value: number = undefined;
}

export class ParkingSourceAnalysisEntity extends EntityBase {
  public name: string = undefined;
  public parking_name: string = undefined;
  public parking_type: string = undefined;
  public spot: number = undefined;
}

export class VehicleAccessEntity extends EntityBase {
  public name: string = undefined;
  public car_id: string = undefined;
  public entrance_time: string = undefined;
  public exit_time: string = undefined;
}
