import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import {
  EmployeeEntity,
  EmployeeParams,
  InsideHttpService,
  ParkingRecordEntity,
  ParkingSpotEntity,
  RoadParkingEntity
} from '../../inside-http.service';

@Component({
  selector: 'app-road-modal',
  templateUrl: './road-modal.component.html',
  styleUrls: ['./road-modal.component.less']
})
export class RoadModalComponent implements OnInit {

  public spotList: Array<Array<ParkingSpotEntity>> = [];

  public roadParking: RoadParkingEntity = new RoadParkingEntity();

  public employeeInfo: EmployeeEntity;

  @ViewChild('roadModal') private roadModal: ElementRef;

  private requestSubscription: Subscription;

  constructor(private renderder2: Renderer2,
              private insideHttpService: InsideHttpService) {
  }

  ngOnInit(): void {
  }

  public show(roadParking?: RoadParkingEntity): void {
    this.requestSubscription && this.requestSubscription.unsubscribe();
    this.spotList = [];
    this.employeeInfo = null;
    this.renderder2.setStyle(this.roadModal.nativeElement, 'display', 'block');
    if (roadParking) {
      this.roadParking = roadParking;

      const employeeParams = new EmployeeParams();
      employeeParams.parking_id = roadParking.parking_id;
      const httpList = [
        this.insideHttpService.requestEmployeeList(employeeParams),
        this.insideHttpService.requestAllParkingSpots(roadParking.parking_id),
        this.insideHttpService.requestAllParkingRecords(roadParking.parking_id)
      ];
      this.requestSubscription = forkJoin(httpList).subscribe((results: Array<any>) => {
        const employees: Array<EmployeeEntity> = results[0];
        const spots: Array<ParkingSpotEntity> = results[1];
        const parkingRecords: Array<ParkingRecordEntity> = results[2];

        if (employees.length > 0) {
          // 暂时只显示第一个收费员信息
          this.employeeInfo = employees[0];
        }

        const tempSpotList = [];
        spots.forEach((spot, index) => {
          const zIndex = index % 8;
          if (zIndex === 0) {
            tempSpotList.push(new Array(8).fill(''));
          }
          const findRecord = parkingRecords.find(record => record.remote_spot_id === spot.remote_spot_id);
          if (findRecord) {
            spot.carId = findRecord.car_id;
          }
          tempSpotList[tempSpotList.length - 1][zIndex] = spot;
        });
        this.spotList = tempSpotList;
      });
    }
  }

  public close(): void {
    this.renderder2.setStyle(this.roadModal.nativeElement, 'display', 'none');
    this.requestSubscription && this.requestSubscription.unsubscribe();
  }

}
